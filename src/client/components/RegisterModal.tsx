import React, { useState, useEffect } from 'react';

interface PublicConfig {
    enabled: boolean;
    auto_login: boolean;
    require_terms: boolean;
    terms_url: string;
    privacy_url: string;
    bot_protection: string;
    captcha_site_key: string;
    min_password_length: number;
    require_special_char: boolean;
    require_number: boolean;
}

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin?: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [config, setConfig] = useState<PublicConfig>({
        enabled: true,
        auto_login: true,
        require_terms: false,
        terms_url: '/terms',
        privacy_url: '/privacy',
        bot_protection: 'none',
        captcha_site_key: '',
        min_password_length: 8,
        require_special_char: true,
        require_number: true,
    });

    const [loadingConfig, setLoadingConfig] = useState(true);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string>('');

    // Fetch public configuration
    useEffect(() => {
        if (!isOpen) return;

        const fetchConfig = async () => {
            const urls = [
                '/api/client/extensions/user-registration/config',
                '/api/public/registration/config',
            ];

            for (const url of urls) {
                try {
                    const res = await fetch(url, {
                        headers: { 'Accept': 'application/json' },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setConfig(data);
                        break;
                    }
                } catch (e) {}
            }
            setLoadingConfig(false);
        };

        fetchConfig();
    }, [isOpen]);

    // Calculate password strength
    const getStrength = (pass: string) => {
        let score = 0;
        if (!pass) return { score: 0, text: '', color: 'transparent' };
        if (pass.length >= (config.min_password_length || 8)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^a-zA-Z0-9]/.test(pass)) score++;
        if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;

        if (score <= 1) return { score: 1, text: 'Weak', color: '#ef4444' };
        if (score === 2) return { score: 2, text: 'Fair', color: '#f59e0b' };
        if (score === 3) return { score: 3, text: 'Good', color: '#818cf8' };
        return { score: 4, text: 'Strong', color: '#10b981' };
    };

    const strength = getStrength(password);
    const passwordsMatch = password.length > 0 && passwordConfirm.length > 0 && password === passwordConfirm;
    const passwordsMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        // Client validation
        if (!firstname.trim() || !lastname.trim()) {
            setErrorMessage('Please enter both your first and last name.');
            return;
        }

        if (!username.trim() || username.length < 3) {
            setErrorMessage('Username must be at least 3 characters long.');
            return;
        }

        if (!/^[a-zA-Z0-9_\-\.]+$/.test(username)) {
            setErrorMessage('Username can only contain letters, numbers, hyphens, and underscores.');
            return;
        }

        if (!email.trim() || !email.includes('@')) {
            setErrorMessage('Please provide a valid email address.');
            return;
        }

        if (password.length < (config.min_password_length || 8)) {
            setErrorMessage(`Password must be at least ${config.min_password_length || 8} characters long.`);
            return;
        }

        if (config.require_number && !/[0-9]/.test(password)) {
            setErrorMessage('Password must include at least one number.');
            return;
        }

        if (config.require_special_char && !/[^a-zA-Z0-9]/.test(password)) {
            setErrorMessage('Password must include at least one special character or symbol.');
            return;
        }

        if (password !== passwordConfirm) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        if (config.require_terms && !agreedTerms) {
            setErrorMessage('You must agree to the Terms of Service & Privacy Policy.');
            return;
        }

        setSubmitting(true);

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        const payload = {
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            username: username.trim(),
            email: email.trim(),
            password,
            password_confirmation: passwordConfirm,
            terms: agreedTerms,
            captcha_token: captchaToken,
        };

        const endpoints = [
            '/api/client/extensions/user-registration/register',
            '/api/public/registration/register',
        ];

        let succeeded = false;

        for (const ep of endpoints) {
            try {
                const res = await fetch(ep, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(payload),
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    succeeded = true;
                    setSuccessMessage(data.message || 'Account created successfully!');

                    // If auto-logged in, navigate to dashboard immediately
                    if (data.auto_login) {
                        setTimeout(() => {
                            window.location.href = data.redirect || '/';
                        }, 1200);
                    }
                    break;
                } else if (data.error) {
                    setErrorMessage(data.error);
                    break;
                }
            } catch (err: any) {
                // Try next endpoint
            }
        }

        if (!succeeded && !errorMessage) {
            setErrorMessage('Registration failed. Please check your information and try again.');
        }

        setSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="reg-modal-backdrop" onClick={onClose}>
            <div className="reg-modal-card" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button type="button" className="reg-modal-close" onClick={onClose} title="Close">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Header */}
                <div style={{ marginBottom: 20 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: '0 0 6px 0' }}>
                        Create an Account
                    </h2>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--reg-text-muted)', margin: 0 }}>
                        Join the platform to deploy, configure, and manage your game servers.
                    </p>
                </div>

                {/* Registration Disabled Notice */}
                {!loadingConfig && !config.enabled ? (
                    <div className="reg-alert reg-alert-danger">
                        <span>Public registration is currently disabled by administrator.</span>
                    </div>
                ) : successMessage ? (
                    /* Success View */
                    <div style={{ textAlign: 'center', padding: '24px 8px' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="#10b981" strokeWidth="2.5" fill="none">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', margin: '0 0 8px 0' }}>
                            Welcome Aboard!
                        </h3>
                        <p style={{ fontSize: '0.84rem', color: 'var(--reg-text-muted)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
                            {successMessage}
                        </p>
                        {config.auto_login ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.8125rem', color: '#818cf8' }}>
                                <span className="reg-spinner" />
                                <span>Redirecting you to dashboard...</span>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="reg-btn reg-btn-primary"
                                style={{ width: '100%', height: 42 }}
                                onClick={() => {
                                    if (onSwitchToLogin) onSwitchToLogin();
                                    else window.location.href = '/auth/login';
                                }}
                            >
                                Proceed to Login
                            </button>
                        )}
                    </div>
                ) : (
                    /* Form View */
                    <form onSubmit={handleSubmit}>
                        {errorMessage && (
                            <div className="reg-alert reg-alert-danger">
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{ flexShrink: 0 }}>
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Name Grid */}
                        <div className="reg-form-grid-2">
                            <div>
                                <label className="reg-label">First Name</label>
                                <input
                                    type="text"
                                    className="reg-input"
                                    placeholder="John"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    required
                                    autoComplete="given-name"
                                />
                            </div>
                            <div>
                                <label className="reg-label">Last Name</label>
                                <input
                                    type="text"
                                    className="reg-input"
                                    placeholder="Doe"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    required
                                    autoComplete="family-name"
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className="reg-form-row">
                            <label className="reg-label">Username</label>
                            <div className="reg-input-wrap">
                                <span className="reg-input-icon">
                                    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    className="reg-input has-icon"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="reg-form-row">
                            <label className="reg-label">Email Address</label>
                            <div className="reg-input-wrap">
                                <span className="reg-input-icon">
                                    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    className="reg-input has-icon"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="reg-form-row">
                            <label className="reg-label">Password</label>
                            <div className="reg-input-wrap">
                                <span className="reg-input-icon">
                                    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="reg-input has-icon has-icon-right"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="reg-input-action"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Strength indicator */}
                            {password.length > 0 && (
                                <div className="reg-strength-container">
                                    <div className="reg-strength-bars">
                                        {[1, 2, 3, 4].map((bar) => (
                                            <div
                                                key={bar}
                                                className="reg-strength-bar"
                                                style={{
                                                    backgroundColor: bar <= strength.score ? strength.color : undefined,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className="reg-strength-label">
                                        <span>Security: <strong style={{ color: strength.color }}>{strength.text}</strong></span>
                                        <span>Min {config.min_password_length} chars</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Password Confirmation */}
                        <div className="reg-form-row">
                            <label className="reg-label">Confirm Password</label>
                            <div className="reg-input-wrap">
                                <span className="reg-input-icon">
                                    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="reg-input has-icon has-icon-right"
                                    placeholder="••••••••••••"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                {passwordsMatch && (
                                    <span style={{ position: 'absolute', right: 12, color: '#10b981', display: 'flex', alignItems: 'center' }}>
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </span>
                                )}
                                {passwordsMismatch && (
                                    <span style={{ position: 'absolute', right: 12, color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Terms Agreement */}
                        {config.require_terms && (
                            <div style={{ margin: '14px 0 18px 0' }}>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--reg-text-muted)' }}>
                                    <input
                                        type="checkbox"
                                        checked={agreedTerms}
                                        onChange={(e) => setAgreedTerms(e.target.checked)}
                                        style={{ marginTop: 2, accentColor: '#6366f1' }}
                                        required
                                    />
                                    <span>
                                        I agree to the{' '}
                                        <a href={config.terms_url} target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', textDecoration: 'underline' }}>
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href={config.privacy_url} target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', textDecoration: 'underline' }}>
                                            Privacy Policy
                                        </a>.
                                    </span>
                                </label>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div style={{ marginTop: 20 }}>
                            <button
                                type="submit"
                                className="reg-btn reg-btn-primary"
                                style={{ width: '100%', height: 42, fontSize: '0.9rem' }}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="reg-spinner" />
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>

                        {/* Switch to Login Link */}
                        <div style={{ marginTop: 18, textAlign: 'center', fontSize: '0.8125rem', color: 'var(--reg-text-muted)' }}>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    if (onSwitchToLogin) onSwitchToLogin();
                                    else window.location.href = '/auth/login';
                                }}
                                style={{ background: 'transparent', border: 'none', color: '#818cf8', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                            >
                                Sign in here &rarr;
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
