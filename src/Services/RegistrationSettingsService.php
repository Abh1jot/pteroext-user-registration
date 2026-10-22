<?php

namespace UserRegistration\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Http;

class RegistrationSettingsService
{
    protected static array $defaults = [
        'enabled' => true,
        'auto_login' => true,
        'require_terms' => false,
        'terms_url' => '/terms',
        'privacy_url' => '/privacy',
        'bot_protection' => 'none', // none, turnstile, recaptcha_v2, recaptcha_v3
        'captcha_site_key' => '',
        'captcha_secret_key' => '',
        'block_disposable_emails' => true,
        'blocked_domains' => '',
        'whitelisted_domains' => '',
        'min_password_length' => 8,
        'require_special_char' => true,
        'require_number' => true,
        'rate_limit_per_hour' => 5,
        'welcome_email_enabled' => true,
    ];

    /**
     * Common disposable & temporary email domains.
     */
    protected static array $disposableDomains = [
        '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minmail.com',
        'tempmail.com', 'tempmail.net', 'temp-mail.org', 'temp-mail.io',
        'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz', 'guerrillamailblock.com',
        'mailinator.com', 'mailinator.net', 'mailinator2.com', 'mailinater.com',
        'yopmail.com', 'yopmail.net', 'yopmail.fr', 'cool.fr.nf', 'jetable.fr.nf',
        'throwawaymail.com', 'throwawayemailaddress.com',
        'sharklasers.com', 'grr.la', 'pokemail.net', 'spam4.me',
        'trashmail.com', 'trashmail.net', 'trashmail.org', 'trashmail.me',
        'fakeinbox.com', 'fakemailgenerator.com', 'dispostable.com',
        'getairmail.com', 'dropmail.me', 'mohmal.com', 'burnermail.io',
        'nada.ltd', 'nada.email', 'inboxkitten.com', 'emailondeck.com',
        'crazymailing.com', 'tmail.ws', 'tmail.link', 'mytemp.email',
        'mintemail.com', 'maildrop.cc', 'harakirimail.com', 'generator.email',
        'fakermail.com', 'disposablemail.com', 'deadaddress.com', 'dayrep.com',
        'binkmail.com', 'armyspy.com', 'anonbox.net', '20minutemail.com',
        'cuvox.de', 'einrot.com', 'fleckens.hu', 'gustr.com', 'jourrapide.com',
        'rhyta.com', 'superrito.com', 'teleworm.us', 'crazymailing.com'
    ];

    /**
     * Get all registration settings.
     */
    public function getSettings(): array
    {
        $settings = self::$defaults;

        try {
            if (Schema::hasTable('ext_user_registration_settings')) {
                $rows = DB::table('ext_user_registration_settings')->get();
                foreach ($rows as $row) {
                    $val = json_decode($row->value, true);
                    $settings[$row->key] = $val !== null ? $val : $row->value;
                }
            }
        } catch (\Throwable $e) {}

        return $settings;
    }

    /**
     * Update settings in database.
     */
    public function updateSettings(array $values): void
    {
        try {
            if (Schema::hasTable('ext_user_registration_settings')) {
                foreach ($values as $key => $val) {
                    if (array_key_exists($key, self::$defaults)) {
                        DB::table('ext_user_registration_settings')->updateOrInsert(
                            ['key' => $key],
                            [
                                'value' => is_bool($val) || is_array($val) || is_numeric($val) ? json_encode($val) : (string) $val,
                                'updated_at' => now(),
                            ]
                        );
                    }
                }
            }
        } catch (\Throwable $e) {}
    }

    /**
     * Get public config safe for visitors.
     */
    public function getPublicConfig(): array
    {
        $settings = $this->getSettings();

        return [
            'enabled' => (bool) ($settings['enabled'] ?? true),
            'auto_login' => (bool) ($settings['auto_login'] ?? true),
            'require_terms' => (bool) ($settings['require_terms'] ?? false),
            'terms_url' => $settings['terms_url'] ?? '/terms',
            'privacy_url' => $settings['privacy_url'] ?? '/privacy',
            'bot_protection' => $settings['bot_protection'] ?? 'none',
            'captcha_site_key' => $settings['captcha_site_key'] ?? '',
            'min_password_length' => (int) ($settings['min_password_length'] ?? 8),
            'require_special_char' => (bool) ($settings['require_special_char'] ?? true),
            'require_number' => (bool) ($settings['require_number'] ?? true),
        ];
    }

    /**
     * Verify if email domain is allowed.
     */
    public function validateEmailDomain(string $email, array $settings): array
    {
        $parts = explode('@', strtolower(trim($email)));
        if (count($parts) !== 2) {
            return ['allowed' => false, 'reason' => 'Invalid email address format.'];
        }

        $domain = $parts[1];

        // 1. Check disposable email blacklist
        if (!empty($settings['block_disposable_emails'])) {
            if (in_array($domain, self::$disposableDomains, true)) {
                return ['allowed' => false, 'reason' => 'Disposable and temporary email addresses are not allowed. Please use a permanent email.'];
            }
        }

        // 2. Check custom blocked domains
        if (!empty($settings['blocked_domains'])) {
            $blocked = array_filter(array_map('trim', preg_split('/[\r\n,]+/', strtolower($settings['blocked_domains']))));
            foreach ($blocked as $bDomain) {
                if ($domain === $bDomain || str_ends_with($domain, '.' . $bDomain)) {
                    return ['allowed' => false, 'reason' => "The email domain '{$domain}' is blocked on this panel."];
                }
            }
        }

        // 3. Check whitelisted domains (if specified, only these are allowed)
        if (!empty($settings['whitelisted_domains'])) {
            $whitelisted = array_filter(array_map('trim', preg_split('/[\r\n,]+/', strtolower($settings['whitelisted_domains']))));
            $isWhitelisted = false;
            foreach ($whitelisted as $wDomain) {
                if ($domain === $wDomain || str_ends_with($domain, '.' . $wDomain)) {
                    $isWhitelisted = true;
                    break;
                }
            }
            if (!$isWhitelisted) {
                return ['allowed' => false, 'reason' => 'Only authorized email domains are allowed to register on this panel.'];
            }
        }

        return ['allowed' => true];
    }

    /**
     * Verify Captcha token.
     */
    public function verifyCaptcha(?string $token, array $settings, ?string $remoteIp = null): bool
    {
        $type = $settings['bot_protection'] ?? 'none';
        if ($type === 'none' || empty($settings['captcha_secret_key'])) {
            return true;
        }

        if (empty($token)) {
            return false;
        }

        try {
            if ($type === 'turnstile') {
                $response = Http::asForm()->timeout(5)->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                    'secret' => $settings['captcha_secret_key'],
                    'response' => $token,
                    'remoteip' => $remoteIp,
                ]);
                return (bool) ($response->json('success') === true);
            }

            if ($type === 'recaptcha_v2' || $type === 'recaptcha_v3') {
                $response = Http::asForm()->timeout(5)->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => $settings['captcha_secret_key'],
                    'response' => $token,
                    'remoteip' => $remoteIp,
                ]);
                $data = $response->json();
                if (empty($data['success'])) {
                    return false;
                }
                if ($type === 'recaptcha_v3' && isset($data['score']) && $data['score'] < 0.5) {
                    return false;
                }
                return true;
            }
        } catch (\Throwable $e) {
            // In case of timeout or connection issue, log and permit if configured
            return false;
        }

        return true;
    }

    /**
     * Check registration rate limit for client IP.
     */
    public function isRateLimited(string $ip, int $maxPerHour = 5): bool
    {
        try {
            if (!Schema::hasTable('ext_user_registrations_log')) {
                return false;
            }

            $count = DB::table('ext_user_registrations_log')
                ->where('ip_address', $ip)
                ->where('created_at', '>=', now()->subHour())
                ->count();

            return $count >= $maxPerHour;
        } catch (\Throwable $e) {
            return false;
        }
    }

    /**
     * Log a registration attempt.
     */
    public function logAttempt(array $data): void
    {
        try {
            if (Schema::hasTable('ext_user_registrations_log')) {
                DB::table('ext_user_registrations_log')->insert([
                    'user_id' => $data['user_id'] ?? null,
                    'username' => substr($data['username'] ?? '', 0, 64),
                    'email' => substr($data['email'] ?? '', 0, 191),
                    'name_first' => substr($data['name_first'] ?? '', 0, 64),
                    'name_last' => substr($data['name_last'] ?? '', 0, 64),
                    'ip_address' => substr($data['ip_address'] ?? '', 0, 45),
                    'status' => substr($data['status'] ?? 'success', 0, 32),
                    'details' => $data['details'] ?? null,
                    'user_agent' => substr($data['user_agent'] ?? '', 0, 255),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        } catch (\Throwable $e) {}
    }
}
