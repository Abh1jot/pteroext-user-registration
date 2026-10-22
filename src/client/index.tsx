import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { definePterodactylExtension } from '@pterodactyl/sdk';
import { RegisterModal } from './components/RegisterModal';
import './styles.css';

/**
 * Public Registration Floating Action & Modal Host Component
 */
const RegistrationPublicHost: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // Auto-open modal if URL path is /auth/register or hash is #register
        const checkHash = () => {
            const path = window.location.pathname.toLowerCase();
            const hash = window.location.hash.toLowerCase();
            if (path.endsWith('/register') || hash === '#register') {
                setModalOpen(true);
            }
        };

        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, []);

    // Detect if current page is the authentication/login page
    const isAuthPage = typeof window !== 'undefined' && (
        window.location.pathname.includes('/auth') ||
        window.location.pathname.includes('/login')
    );

    // If user is already authenticated, don't show registration prompt
    const isAuthenticated = typeof window !== 'undefined' && Boolean((window as any).PterodactylUser);
    if (isAuthenticated) {
        return null;
    }

    return (
        <>
            {/* Direct Register Modal */}
            <RegisterModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    if (window.location.hash === '#register') {
                        history.replaceState(null, '', window.location.pathname);
                    }
                }}
                onSwitchToLogin={() => {
                    setModalOpen(false);
                    if (window.location.hash === '#register') {
                        history.replaceState(null, '', window.location.pathname);
                    }
                }}
            />

            {/* Quick Registration Button on Login Pages */}
            {isAuthPage && !modalOpen && (
                <div
                    id="pteroext-reg-quick-btn"
                    style={{
                        position: 'fixed',
                        top: 24,
                        right: 24,
                        zIndex: 9999,
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="reg-btn reg-btn-primary"
                        style={{
                            height: 38,
                            padding: '0 16px',
                            fontSize: '0.84rem',
                            borderRadius: 8,
                            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                        <span>Create Account</span>
                    </button>
                </div>
            )}
        </>
    );
};

let hostMounted = false;

function mountPublicRegistrationHost() {
    if (typeof document === 'undefined') return;
    if (hostMounted) return;

    // Only mount on visitor pages
    const isAuth = Boolean((window as any).PterodactylUser);
    if (isAuth) return;

    const ROOT_ID = 'pteroext-user-registration-root';
    let container = document.getElementById(ROOT_ID);
    if (!container) {
        container = document.createElement('div');
        container.id = ROOT_ID;
        document.body.appendChild(container);
    }

    try {
        const root = createRoot(container);
        root.render(<RegistrationPublicHost />);
        hostMounted = true;
    } catch (e) {
        console.warn('[UserRegistration] Failed to mount public registration host:', e);
    }
}

// Auto mount on document ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => mountPublicRegistrationHost());
    } else {
        setTimeout(() => mountPublicRegistrationHost(), 100);
    }
}

export default definePterodactylExtension({
    setup({ screens, slots }: any = {}) {
        // Register Admin Registration screen
        if (screens && typeof screens.register === 'function') {
            screens.register('admin-registration', () => import('./screens/AdminRegistrationScreen'));
        }

        // Register slots if available in theme
        if (slots && typeof slots.register === 'function') {
            slots.register('auth.login.after', RegistrationPublicHost);
            slots.register('auth.container.after', RegistrationPublicHost);
        }

        // Ensure global host is mounted for all themes
        mountPublicRegistrationHost();
    },
});
