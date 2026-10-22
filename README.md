# Pterodactyl 2.0 User Registration Addon

A high-performance, modern, and secure user registration extension for **Pterodactyl 2.0**. Allows new visitors and clients to create an account directly on your panel with automated bot protection, disposable email filtering, domain policies, and administrative audit logs.

---

## Features

* **Public User Registration**: Provides a streamlined, modern registration form directly integrated into Pterodactyl's authentication pages.
* **Instant Auto-Login**: Automatically authenticates newly registered users and redirects them to the panel dashboard without requiring manual sign-in.
* **Bot & Spam Defense**:
  * Built-in support for **Cloudflare Turnstile** (fast, invisible, privacy-friendly).
  * Support for **Google reCAPTCHA v2 (Checkbox)** and **reCAPTCHA v3 (Invisible Score)**.
  * Configurable IP rate limiting to prevent automated registration spam (default: 5 registrations per IP per hour).
* **Disposable Email Blocker**: Automatically detects and blocks 200+ known disposable, temporary, and burner mailbox services (e.g. *10minutemail*, *temp-mail*, *guerrillamail*, *mailinator*, *yopmail*).
* **Domain Whitelisting & Blacklisting**:
  * Blacklist specific spam domains.
  * Whitelist authorized domains (optional: restrict sign-ups to company, school, or organization domains).
* **Password Policy & Strength Meter**:
  * Real-time client-side security feedback (Weak, Fair, Good, Strong).
  * Enforce minimum length, numerical digits, and special characters.
* **Compliance & Legal**: Mandatory Terms of Service and Privacy Policy checkbox with customizable links.
* **Root Administrator Management**:
  * Dedicated admin screen located at `/admin/registration`.
  * Real-time KPI metrics: Total Accounts Registered, Registrations Today, Registrations This Week, Spam Threats Blocked.
  * Full registration audit trail with IP address, user agent, timestamp, and status tracking.
  * One-click clear audit logs.
* **Clean & Modern UI**: Zero emojis, sleek high-contrast dark aesthetic built with Vanilla CSS and React.

---

## Installation

### 1. Manual Installation
1. Upload the extension package or clone this repository into your Pterodactyl extensions directory:
   ```bash
   cd /var/www/pterodactyl/extensions
   git clone https://github.com/Abh1jot/pteroext-user-registration.git user-registration
   ```

2. Run database migrations:
   ```bash
   php artisan migrate --force
   ```

3. Clear panel cache:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan view:clear
   ```

---

## Configuration

Navigate to the Pterodactyl Admin Panel:
1. Go to **Extensions** &rarr; **User Registration**.
2. Customize your registration rules:
   * **General Settings**: Toggle public registration, automatic login, and terms agreement.
   * **Security & Anti-Bot**: Configure Cloudflare Turnstile or Google reCAPTCHA keys, rate limiting, and password length.
   * **Email Policies**: Enable disposable email blocking and add custom domain blacklists or whitelists.
   * **Audit Logs**: Inspect recent registrations and blocked attempts.

---

## API Endpoints

### Public / Client Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/public/registration/config` | Returns public registration configuration (enabled state, captcha site key, terms URL). |
| `POST` | `/api/public/registration/register` | Handles user registration with validation, captcha check, rate limiting, and account provisioning. |

### Administrative Endpoints (Root Admin Only)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/extensions/user-registration/settings` | Returns configuration settings and live registration metrics. |
| `POST` | `/api/admin/extensions/user-registration/settings` | Updates registration preferences, captcha keys, and email domain rules. |
| `GET` | `/api/admin/extensions/user-registration/logs` | Fetches recent registration audit logs. |
| `DELETE` | `/api/admin/extensions/user-registration/logs` | Clears registration audit log history. |

---

## Development & Building

To rebuild frontend assets:

```bash
npm install
npm run build
```

Compiled assets are saved in `dist/`.

---

## License

This project is licensed under the [MIT License](LICENSE).
