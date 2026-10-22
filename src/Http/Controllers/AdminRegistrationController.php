<?php

namespace UserRegistration\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use UserRegistration\Services\RegistrationSettingsService;

class AdminRegistrationController extends Controller
{
    protected RegistrationSettingsService $settingsService;

    public function __construct(RegistrationSettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    /**
     * Ensure the authenticated user has root administrator permissions.
     */
    protected function authorizeAdmin(Request $request): ?JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->root_admin) {
            return response()->json(['error' => 'Unauthorized action. Root administrator privileges required.'], 403);
        }

        return null;
    }

    /**
     * Get administration settings and live metrics.
     */
    public function getSettings(Request $request): JsonResponse
    {
        if ($authError = $this->authorizeAdmin($request)) {
            return $authError;
        }

        $settings = $this->settingsService->getSettings();
        $stats = [
            'total_registered' => 0,
            'registered_today' => 0,
            'registered_this_week' => 0,
            'blocked_attempts' => 0,
        ];

        try {
            if (Schema::hasTable('ext_user_registrations_log')) {
                $stats['total_registered'] = DB::table('ext_user_registrations_log')
                    ->where('status', 'success')
                    ->count();

                $stats['registered_today'] = DB::table('ext_user_registrations_log')
                    ->where('status', 'success')
                    ->where('created_at', '>=', now()->startOfDay())
                    ->count();

                $stats['registered_this_week'] = DB::table('ext_user_registrations_log')
                    ->where('status', 'success')
                    ->where('created_at', '>=', now()->startOfWeek())
                    ->count();

                $stats['blocked_attempts'] = DB::table('ext_user_registrations_log')
                    ->whereIn('status', ['blocked_domain', 'blocked_rate_limit', 'blocked_captcha', 'disabled'])
                    ->count();
            }
        } catch (\Throwable $e) {}

        return response()->json([
            'settings' => $settings,
            'stats' => $stats,
        ]);
    }

    /**
     * Update administration settings.
     */
    public function updateSettings(Request $request): JsonResponse
    {
        if ($authError = $this->authorizeAdmin($request)) {
            return $authError;
        }

        $validated = $request->validate([
            'enabled' => 'nullable|boolean',
            'auto_login' => 'nullable|boolean',
            'require_terms' => 'nullable|boolean',
            'terms_url' => 'nullable|string|max:255',
            'privacy_url' => 'nullable|string|max:255',
            'bot_protection' => 'nullable|string|in:none,turnstile,recaptcha_v2,recaptcha_v3',
            'captcha_site_key' => 'nullable|string|max:255',
            'captcha_secret_key' => 'nullable|string|max:255',
            'block_disposable_emails' => 'nullable|boolean',
            'blocked_domains' => 'nullable|string',
            'whitelisted_domains' => 'nullable|string',
            'min_password_length' => 'nullable|integer|min:6|max:64',
            'require_special_char' => 'nullable|boolean',
            'require_number' => 'nullable|boolean',
            'rate_limit_per_hour' => 'nullable|integer|min:1|max:100',
            'welcome_email_enabled' => 'nullable|boolean',
        ]);

        $this->settingsService->updateSettings($validated);

        return response()->json([
            'success' => true,
            'message' => 'Registration settings saved successfully.',
            'settings' => $this->settingsService->getSettings(),
        ]);
    }

    /**
     * Get recent registration audit logs.
     */
    public function getLogs(Request $request): JsonResponse
    {
        if ($authError = $this->authorizeAdmin($request)) {
            return $authError;
        }

        $limit = min(max((int) $request->query('limit', 50), 10), 100);
        $logs = [];

        try {
            if (Schema::hasTable('ext_user_registrations_log')) {
                $logs = DB::table('ext_user_registrations_log')
                    ->orderBy('created_at', 'desc')
                    ->limit($limit)
                    ->get();
            }
        } catch (\Throwable $e) {}

        return response()->json(['logs' => $logs]);
    }

    /**
     * Clear all registration audit logs.
     */
    public function clearLogs(Request $request): JsonResponse
    {
        if ($authError = $this->authorizeAdmin($request)) {
            return $authError;
        }

        try {
            if (Schema::hasTable('ext_user_registrations_log')) {
                DB::table('ext_user_registrations_log')->truncate();
            }
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Failed to clear audit logs: ' . $e->getMessage()], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Registration audit logs cleared successfully.',
        ]);
    }
}
