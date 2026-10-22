import React, { useState, useEffect } from 'react';
import { toast } from '@pterodactyl/sdk';

interface AdminSettings {
    enabled: boolean;
    auto_login: boolean;
    require_terms: boolean;
    terms_url: string;
    privacy_url: string;
    bot_protection: string;
    captcha_site_key: string;
    captcha_secret_key: string;
    block_disposable_emails: boolean;
    blocked_domains: string;
    whitelisted_domains: string;
    min_password_length: number;
    require_special_char: boolean;
    require_number: boolean;
    rate_limit_per_hour: number;
    welcome_email_enabled: boolean;
}

interface AdminStats {
    total_registered: number;
    registered_today: number;
    registered_this_week: number;
    blocked_attempts: number;
}

interface AuditLogItem {
    id: number;
    user_id: number | null;
    username: string;
    email: string;
    name_first: string | null;
    name_last: string | null;
    ip_address: string;
    status: string;
    details: string | null;
    created_at: string;
}

export default function AdminRegistrationScreen() {
    const isRootAdmin = Boolean(
        (typeof window !== 'undefined' && (
            (window as any).PterodactylUser?.root_admin === true ||
            (window as any).PterodactylUser?.root_admin === 1 ||
            (window as any).PterodactylUser?.admin === true ||
            (window as any).store?.getState?.()?.user?.data?.rootAdmin === true
        ))
    );

    const [activeTab, setActiveTab] = useState<'settings' | 'security' | 'emails' | 'logs'>('settings');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [clearingLogs, setClearingLogs] = useState(false);

    const [settings, setSettings] = useState<AdminSettings>({
        enabled: true,
        auto_login: true,
        require_terms: false,
        terms_url: '/terms',
        privacy_url: '/privacy',
        bot_protection: 'none',
        captcha_site_key: '',
        captcha_secret_key: '',
        block_disposable_emails: true,
        blocked_domains: '',
        whitelisted_domains: '',
        min_password_length: 8,
        require_special_char: true,
        require_number: true,
        rate_limit_per_hour: 5,
        welcome_email_enabled: true,
    });

    const [stats, setStats] = useState<AdminStats>({
        total_registered: 0,
        registered_today: 0,
        registered_this_week: 0,
        blocked_attempts: 0,
    });

    const [logs, setLogs] = useState<AuditLogItem[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const getCsrfToken = () => {
        return (window as any).PterodactylUser?.csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    };

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/extensions/user-registration/settings', {
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
            });

            if (res.ok) {
                const data = await res.json();
                if (data.settings) setSettings(data.settings);
                if (data.stats) setStats(data.stats);
            }
        } catch (e) {
            console.error('Failed to load admin registration settings:', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const res = await fetch('/api/admin/extensions/user-registration/logs', {
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
            }
        } catch (e) {
            console.error('Failed to fetch registration logs:', e);
        } finally {
            setLoadingLogs(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    useEffect(() => {
        if (activeTab === 'logs') {
            fetchLogs();
        }
    }, [activeTab]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/extensions/user-registration/settings', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify(settings),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || 'Settings saved successfully');
                if (data.settings) setSettings(data.settings);
            } else {
                toast.error(data.error || 'Failed to save settings');
            }
        } catch (err: any) {
            toast.error(err.message || 'Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const handleClearLogs = async () => {
        if (!window.confirm('Are you sure you want to clear all registration audit logs?')) return;
        setClearingLogs(true);
        try {
            const res = await fetch('/api/admin/extensions/user-registration/logs', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
            });
            if (res.ok) {
                toast.success('Registration audit logs cleared');
                setLogs([]);
            } else {
                toast.error('Failed to clear logs');
            }
        } catch (e: any) {
            toast.error(e.message || 'Error clearing logs');
        } finally {
            setClearingLogs(false);
        }
    };

    if (!isRootAdmin) {
        return (
            <div className="reg-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h3 style={{ color: '#ef4444' }}>Access Denied</h3>
                <p style={{ color: 'var(--reg-text-muted)' }}>Root administrator privileges are required to view this page.</p>
            </div>
        );
    }

    return (
        <div className="reg-container">
            {/* Topbar */}
            <div className="reg-header">
                <div className="reg-title-wrap">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h1 className="reg-title">User Registration Manager</h1>
                        <span className={`reg-badge ${settings.enabled ? 'reg-badge-success' : 'reg-badge-danger'}`}>
                            {settings.enabled ? 'Public Registration Active' : 'Registration Disabled'}
                        </span>
                    </div>
                    <p className="reg-subtitle">
                        Configure self-registration rules, anti-bot protection, disposable email filtering, and view sign-up audit logs.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                        type="button"
                        className="reg-btn reg-btn-primary"
                        onClick={handleSave}
                        disabled={saving || loading}
                    >
                        {saving ? (
                            <>
                                <span className="reg-spinner" />
                                <span>Saving Changes...</span>
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                                <span>Save Settings</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="reg-stats-grid">
                <div className="reg-stat-card">
                    <div className="reg-stat-header">
                        <span className="reg-stat-label">Total Registered</span>
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="#6366f1" strokeWidth="2" fill="none">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <span className="reg-stat-val">{stats.total_registered.toLocaleString()}</span>
                </div>

                <div className="reg-stat-card">
                    <div className="reg-stat-header">
                        <span className="reg-stat-label">Registered Today</span>
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="#10b981" strokeWidth="2" fill="none">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <span className="reg-stat-val">{stats.registered_today.toLocaleString()}</span>
                </div>

                <div className="reg-stat-card">
                    <div className="reg-stat-header">
                        <span className="reg-stat-label">This Week</span>
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="#38bdf8" strokeWidth="2" fill="none">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </div>
                    <span className="reg-stat-val">{stats.registered_this_week.toLocaleString()}</span>
                </div>

                <div className="reg-stat-card">
                    <div className="reg-stat-header">
                        <span className="reg-stat-label">Threats Blocked</span>
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ef4444" strokeWidth="2" fill="none">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <span className="reg-stat-val" style={{ color: stats.blocked_attempts > 0 ? '#f87171' : 'inherit' }}>
                        {stats.blocked_attempts.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="reg-tabs">
                <button
                    type="button"
                    className={`reg-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    General
                </button>
                <button
                    type="button"
                    className={`reg-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    Security & Captcha
                </button>
                <button
                    type="button"
                    className={`reg-tab-btn ${activeTab === 'emails' ? 'active' : ''}`}
                    onClick={() => setActiveTab('emails')}
                >
                    Email Policies
                </button>
                <button
                    type="button"
                    className={`reg-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('logs')}
                >
                    Audit Logs
                </button>
            </div>

            {/* TAB 1: General Settings */}
            {activeTab === 'settings' && (
                <div className="reg-card">
                    <h3 className="reg-card-title">General Registration Preferences</h3>
                    <p className="reg-card-desc">Control registration accessibility, automated sign-in, and compliance policies.</p>

                    <div className="reg-switch-row">
                        <div className="reg-switch-text">
                            <p className="reg-switch-title">Enable Public User Registration</p>
                            <p className="reg-switch-desc">When disabled, new visitors cannot register new accounts.</p>
                        </div>
                        <label className="reg-switch">
                            <input
                                type="checkbox"
                                checked={settings.enabled}
                                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                            />
                            <span className="reg-slider" />
                        </label>
                    </div>

                    <div className="reg-switch-row">
                        <div className="reg-switch-text">
                            <p className="reg-switch-title">Instant Automatic Login</p>
                            <p className="reg-switch-desc">Automatically create an active session and redirect new users directly to dashboard.</p>
                        </div>
                        <label className="reg-switch">
                            <input
                                type="checkbox"
                                checked={settings.auto_login}
                                onChange={(e) => setSettings({ ...settings, auto_login: e.target.checked })}
                            />
                            <span className="reg-slider" />
                        </label>
                    </div>

                    <div className="reg-switch-row">
                        <div className="reg-switch-text">
                            <p className="reg-switch-title">Require Terms & Privacy Agreement</p>
                            <p className="reg-switch-desc">Users must check a mandatory box agreeing to legal terms before submitting.</p>
                        </div>
                        <label className="reg-switch">
                            <input
                                type="checkbox"
                                checked={settings.require_terms}
                                onChange={(e) => setSettings({ ...settings, require_terms: e.target.checked })}
                            />
                            <span className="reg-slider" />
                        </label>
                    </div>

                    {settings.require_terms && (
                        <div className="reg-form-grid-2" style={{ marginTop: 18 }}>
                            <div>
                                <label className="reg-label">Terms of Service URL</label>
                                <input
                                    type="text"
                                    className="reg-input"
                                    value={settings.terms_url}
                                    onChange={(e) => setSettings({ ...settings, terms_url: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="reg-label">Privacy Policy URL</label>
                                <input
                                    type="text"
                                    className="reg-input"
                                    value={settings.privacy_url}
                                    onChange={(e) => setSettings({ ...settings, privacy_url: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: Security & Captcha */}
            {activeTab === 'security' && (
                <div className="reg-card">
                    <h3 className="reg-card-title">Bot Protection & Password Standards</h3>
                    <p className="reg-card-desc">Defend your panel against automated bot attacks and enforce secure credentials.</p>

                    <div className="reg-form-row">
                        <label className="reg-label">Anti-Bot Protection Provider</label>
                        <select
                            className="reg-select"
                            value={settings.bot_protection}
                            onChange={(e) => setSettings({ ...settings, bot_protection: e.target.value })}
                        >
                            <option value="none">Disabled (No Captcha)</option>
                            <option value="turnstile">Cloudflare Turnstile (Recommended - Fast & Privacy-Friendly)</option>
                            <option value="recaptcha_v2">Google reCAPTCHA v2 (Checkbox)</option>
                            <option value="recaptcha_v3">Google reCAPTCHA v3 (Invisible Score)</option>
                        </select>
                    </div>

                    {settings.bot_protection !== 'none' && (
                        <div className="reg-form-grid-2" style={{ marginTop: 16 }}>
                            <div>
                                <label className="reg-label">Captcha Site Key (Public)</label>
                                <input
                                    type="text"
                                    className="reg-input"
                                    placeholder="0x4AAAAAA..."
                                    value={settings.captcha_site_key}
                                    onChange={(e) => setSettings({ ...settings, captcha_site_key: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="reg-label">Captcha Secret Key (Private)</label>
                                <input
                                    type="password"
                                    className="reg-input"
                                    placeholder="0x4AAAAAA..."
                                    value={settings.captcha_secret_key}
                                    onChange={(e) => setSettings({ ...settings, captcha_secret_key: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--reg-card-border)' }}>
                        <div className="reg-form-grid-2">
                            <div>
                                <label className="reg-label">Minimum Password Length</label>
                                <input
                                    type="number"
                                    className="reg-input"
                                    min={6}
                                    max={64}
                                    value={settings.min_password_length}
                                    onChange={(e) => setSettings({ ...settings, min_password_length: Number(e.target.value) })}
                                />
                                <span className="reg-label-sub">Default is 8 characters.</span>
                            </div>
                            <div>
                                <label className="reg-label">IP Rate Limit (PerHour)</label>
                                <input
                                    type="number"
                                    className="reg-input"
                                    min={1}
                                    max={100}
                                    value={settings.rate_limit_per_hour}
                                    onChange={(e) => setSettings({ ...settings, rate_limit_per_hour: Number(e.target.value) })}
                                />
                                <span className="reg-label-sub">Maximum sign-ups allowed per single IP per hour.</span>
                            </div>
                        </div>

                        <div className="reg-switch-row" style={{ marginTop: 12 }}>
                            <div className="reg-switch-text">
                                <p className="reg-switch-title">Require Number (0-9)</p>
                                <p className="reg-switch-desc">User passwords must contain at least one numerical digit.</p>
                            </div>
                            <label className="reg-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.require_number}
                                    onChange={(e) => setSettings({ ...settings, require_number: e.target.checked })}
                                />
                                <span className="reg-slider" />
                            </label>
                        </div>

                        <div className="reg-switch-row">
                            <div className="reg-switch-text">
                                <p className="reg-switch-title">Require Special Character / Symbol</p>
                                <p className="reg-switch-desc">User passwords must contain at least one symbol (!@#$%^&*).</p>
                            </div>
                            <label className="reg-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.require_special_char}
                                    onChange={(e) => setSettings({ ...settings, require_special_char: e.target.checked })}
                                />
                                <span className="reg-slider" />
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: Email Policies */}
            {activeTab === 'emails' && (
                <div className="reg-card">
                    <h3 className="reg-card-title">Email Domain Rules</h3>
                    <p className="reg-card-desc">Control which email providers and domains are accepted on this installation.</p>

                    <div className="reg-switch-row">
                        <div className="reg-switch-text">
                            <p className="reg-switch-title">Block Disposable & Temporary Inboxes</p>
                            <p className="reg-switch-desc">
                                Automatically rejects 200+ popular burner domains (10minutemail, temp-mail, guerrillamail, mailinator, etc.).
                            </p>
                        </div>
                        <label className="reg-switch">
                            <input
                                type="checkbox"
                                checked={settings.block_disposable_emails}
                                onChange={(e) => setSettings({ ...settings, block_disposable_emails: e.target.checked })}
                            />
                            <span className="reg-slider" />
                        </label>
                    </div>

                    <div className="reg-form-row" style={{ marginTop: 18 }}>
                        <label className="reg-label">Custom Blocked Domains (Blacklist)</label>
                        <textarea
                            className="reg-textarea"
                            placeholder="spamdomain.com, fake-mail.org (comma or newline separated)"
                            value={settings.blocked_domains}
                            onChange={(e) => setSettings({ ...settings, blocked_domains: e.target.value })}
                        />
                        <span className="reg-label-sub">Any email ending in these domains will be rejected immediately.</span>
                    </div>

                    <div className="reg-form-row" style={{ marginTop: 18 }}>
                        <label className="reg-label">Authorized Domains Only (Whitelist)</label>
                        <textarea
                            className="reg-textarea"
                            placeholder="Leave empty to allow all valid domains. (e.g. company.com, school.edu)"
                            value={settings.whitelisted_domains}
                            onChange={(e) => setSettings({ ...settings, whitelisted_domains: e.target.value })}
                        />
                        <span className="reg-label-sub">
                            Optional: If populated, ONLY users with emails matching these domains can register.
                        </span>
                    </div>
                </div>
            )}

            {/* TAB 4: Audit Logs */}
            {activeTab === 'logs' && (
                <div className="reg-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                        <div>
                            <h3 className="reg-card-title">Registration Audit Trail</h3>
                            <p className="reg-card-desc" style={{ marginBottom: 0 }}>
                                Live history of recent registration events and blocked attempts.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                type="button"
                                className="reg-btn reg-btn-secondary"
                                onClick={fetchLogs}
                                disabled={loadingLogs}
                            >
                                Refresh
                            </button>
                            <button
                                type="button"
                                className="reg-btn reg-btn-danger"
                                onClick={handleClearLogs}
                                disabled={clearingLogs || logs.length === 0}
                            >
                                Clear History
                            </button>
                        </div>
                    </div>

                    {loadingLogs ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--reg-text-muted)' }}>
                            <span className="reg-spinner" />
                            <p style={{ marginTop: 8, fontSize: '0.84rem' }}>Loading logs...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--reg-text-muted)', fontSize: '0.84rem' }}>
                            No registration activity recorded yet.
                        </div>
                    ) : (
                        <div className="reg-table-wrap">
                            <table className="reg-table">
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>User Details</th>
                                        <th>IP Address</th>
                                        <th>Status</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => {
                                        let badgeClass = 'reg-badge-neutral';
                                        if (log.status === 'success') badgeClass = 'reg-badge-success';
                                        else if (log.status.startsWith('blocked_')) badgeClass = 'reg-badge-danger';
                                        else if (log.status === 'disabled') badgeClass = 'reg-badge-warning';

                                        return (
                                            <tr key={log.id}>
                                                <td style={{ whiteSpace: 'nowrap', color: 'var(--reg-text-subtle)', fontSize: '0.75rem' }}>
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{log.username}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--reg-text-muted)' }}>{log.email}</div>
                                                </td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                                                    {log.ip_address}
                                                </td>
                                                <td>
                                                    <span className={`reg-badge ${badgeClass}`}>
                                                        {log.status.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '0.75rem', color: 'var(--reg-text-muted)' }}>
                                                    {log.details || '—'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
