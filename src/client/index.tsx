import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { definePterodactylExtension } from '@pterodactyl/sdk';
import { RegisterModal } from './components/RegisterModal';
import './styles.css';

/**
 * Public Registration Modal and Inline Link Host Component
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

    // Inject the registration link directly under "Forgot password?" in the login card/section
    useEffect(() => {
        if (typeof document === 'undefined') return;

        const INLINE_ID = 'pteroext-reg-inline-link';
        const CONTAINER_ID = 'pteroext-reg-inline-container';

        const updateInlineLink = () => {
            // Do not inject if user is authenticated or already injected
            if ((window as any).PterodactylUser) return;
            if (document.getElementById(INLINE_ID)) return;

            // Only mount on auth / login pages
            const isAuth = window.location.pathname.includes('/auth') || window.location.pathname.includes('/login');
            if (!isAuth) return;

            // Find the "Forgot password" link
            const forgotLink = document.querySelector('a[href*="/auth/password"], a[href*="/password"]');
            if (!forgotLink) return;

            // Create container
            const container = document.createElement('div');
            container.id = CONTAINER_ID;

            // Create registration link with exact same font and styling as forgot password
            const regLink = document.createElement('a');
            regLink.id = INLINE_ID;
            regLink.href = '#register';
            regLink.textContent = 'Create an account';

            // Inherit classes from forgot password link
            if (forgotLink.className) {
                regLink.className = forgotLink.className;
            }

            // Copy computed styling to ensure 100% font and visual alignment across themes
            const computed = window.getComputedStyle(forgotLink);
            regLink.style.fontFamily = computed.fontFamily;
            regLink.style.fontSize = computed.fontSize;
            regLink.style.fontWeight = computed.fontWeight;
            regLink.style.lineHeight = computed.lineHeight;
            regLink.style.letterSpacing = computed.letterSpacing;
            regLink.style.textTransform = computed.textTransform;
            regLink.style.cursor = 'pointer';
            regLink.style.display = 'inline-block';

            // Handle layout positioning based on parent container structure
            const parent = forgotLink.parentElement;
            const isFlexRow = parent && (
                window.getComputedStyle(parent).display === 'flex' ||
                parent.className.includes('flex')
            ) && parent.children.length > 1;

            if (isFlexRow && parent) {
                // If in a flex row (e.g. label on left, forgot password on right), place directly beneath right-aligned
                container.style.display = 'block';
                container.style.textAlign = 'right';
                container.style.marginTop = '4px';
                container.style.marginBottom = '2px';
                parent.insertAdjacentElement('afterend', container);
            } else if (parent) {
                // If in a centered or block container, place directly under forgot password
                container.style.display = 'block';
                container.style.marginTop = '6px';
                container.style.textAlign = computed.textAlign || 'center';
                forgotLink.insertAdjacentElement('afterend', container);
            }

            regLink.addEventListener('click', (e) => {
                e.preventDefault();
                setModalOpen(true);
            });

            container.appendChild(regLink);
        };

        updateInlineLink();

        const observer = new MutationObserver(() => {
            updateInlineLink();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            const el = document.getElementById(CONTAINER_ID);
            if (el) el.remove();
        };
    }, []);

    // If user is already authenticated, don't show registration prompt
    const isAuthenticated = typeof window !== 'undefined' && Boolean((window as any).PterodactylUser);
    if (isAuthenticated) {
        return null;
    }

    return (
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
    setup({ screens }: any = {}) {
        // Register Admin Registration screen
        if (screens && typeof screens.register === 'function') {
            screens.register('admin-registration', () => import('./screens/AdminRegistrationScreen'));
        }

        // Ensure global host is mounted for all themes
        mountPublicRegistrationHost();
    },
});
