<?php

namespace UserRegistration\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Pterodactyl\Models\User;
use UserRegistration\Services\RegistrationSettingsService;

class RegistrationController extends Controller
{
    protected RegistrationSettingsService $settingsService;

    public function __construct(RegistrationSettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    /**
     * Get public registration configuration for visitors.
     */
    public function getPublicConfig(Request $request): JsonResponse
    {
        return response()->json($this->settingsService->getPublicConfig());
    }

    /**
     * Handle public user registration.
     */
    public function register(Request $request): JsonResponse
    {
        $settings = $this->settingsService->getSettings();
        $ip = $request->ip() ?? '127.0.0.1';
        $userAgent = $request->header('User-Agent', '');

        // 1. Check if public registration is enabled
        if (empty($settings['enabled'])) {
            $this->settingsService->logAttempt([
                'username' => $request->input('username', 'anonymous'),
                'email' => $request->input('email', 'unknown'),
                'ip_address' => $ip,
                'status' => 'disabled',
                'details' => 'Registration attempted while disabled by administrator.',
                'user_agent' => $userAgent,
            ]);

            return response()->json([
                'error' => 'Public registration is currently disabled by the panel administrator.',
            ], 403);
        }

        // 2. Rate limiting check
        $maxPerHour = (int) ($settings['rate_limit_per_hour'] ?? 5);
        if ($this->settingsService->isRateLimited($ip, $maxPerHour)) {
            $this->settingsService->logAttempt([
                'username' => $request->input('username', 'rate_limited'),
                'email' => $request->input('email', 'rate_limited'),
                'ip_address' => $ip,
                'status' => 'blocked_rate_limit',
                'details' => "Too many registration attempts ({$maxPerHour}/hour limit reached).",
                'user_agent' => $userAgent,
            ]);

            return response()->json([
                'error' => 'Too many registration requests from your IP. Please try again later.',
            ], 429);
        }

        // 3. Normalize inputs for consistent handling
        $input = $request->all();
        if (!isset($input['firstname']) && isset($input['name_first'])) {
            $input['firstname'] = $input['name_first'];
        }
        if (!isset($input['lastname']) && isset($input['name_last'])) {
            $input['lastname'] = $input['name_last'];
        }

        $minPass = (int) ($settings['min_password_length'] ?? 8);
        $rules = [
            'firstname' => 'required|string|min:1|max:50',
            'lastname' => 'required|string|min:1|max:50',
            'username' => ['required', 'string', 'min:3', 'max:30', 'regex:/^[a-zA-Z0-9][a-zA-Z0-9_\-\.]{1,28}[a-zA-Z0-9]$/'],
            'email' => 'required|string|email|max:191',
            'password' => "required|string|min:{$minPass}|confirmed",
        ];

        if (!empty($settings['require_terms'])) {
            $rules['terms'] = 'accepted';
        }

        $validator = Validator::make($input, $rules, [
            'username.regex' => 'Username must start and end with a letter or number, and may contain hyphens, underscores, and periods.',
            'password.confirmed' => 'The password confirmation does not match.',
            'password.min' => "Password must be at least {$minPass} characters long.",
            'terms.accepted' => 'You must agree to the Terms of Service & Privacy Policy to register.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = strtolower(trim((string) ($input['email'] ?? '')));
        $username = trim((string) ($input['username'] ?? ''));
        $firstname = trim((string) ($input['firstname'] ?? ''));
        $lastname = trim((string) ($input['lastname'] ?? ''));
        $password = (string) ($input['password'] ?? '');

        // 4. Password complexity checks
        if (!empty($settings['require_number']) && !preg_match('/[0-9]/', $password)) {
            return response()->json(['error' => 'Password must include at least one number.'], 422);
        }

        if (!empty($settings['require_special_char']) && !preg_match('/[^a-zA-Z0-9]/', $password)) {
            return response()->json(['error' => 'Password must include at least one special character or symbol.'], 422);
        }

        // 5. Check email domain rules (disposable / blocked / whitelisted)
        $domainCheck = $this->settingsService->validateEmailDomain($email, $settings);
        if (!$domainCheck['allowed']) {
            $this->settingsService->logAttempt([
                'username' => $username,
                'email' => $email,
                'name_first' => $firstname,
                'name_last' => $lastname,
                'ip_address' => $ip,
                'status' => 'blocked_domain',
                'details' => $domainCheck['reason'],
                'user_agent' => $userAgent,
            ]);

            return response()->json(['error' => $domainCheck['reason']], 422);
        }

        // 6. Verify Captcha
        $captchaToken = $request->input('captcha_token') ?? $request->input('recaptchaData');
        if (!$this->settingsService->verifyCaptcha($captchaToken, $settings, $ip)) {
            $this->settingsService->logAttempt([
                'username' => $username,
                'email' => $email,
                'ip_address' => $ip,
                'status' => 'blocked_captcha',
                'details' => 'Bot challenge verification failed.',
                'user_agent' => $userAgent,
            ]);

            return response()->json(['error' => 'Bot verification challenge failed. Please refresh and try again.'], 422);
        }

        // 7. Check for existing username or email in database
        try {
            if (DB::table('users')->where('email', $email)->exists()) {
                return response()->json(['error' => 'An account with that email address already exists.'], 422);
            }
            if (DB::table('users')->whereRaw('LOWER(username) = ?', [mb_strtolower($username)])->exists()) {
                return response()->json(['error' => 'That username is already taken. Please choose another.'], 422);
            }
        } catch (\Throwable $chkErr) {
            if (class_exists(User::class)) {
                if (User::where('email', $email)->exists()) {
                    return response()->json(['error' => 'An account with that email address already exists.'], 422);
                }
                if (User::whereRaw('LOWER(username) = ?', [mb_strtolower($username)])->exists()) {
                    return response()->json(['error' => 'That username is already taken. Please choose another.'], 422);
                }
            }
        }

        // 8. Create the user safely with multi-tiered fallbacks
        try {
            $user = null;
            $userUuid = (string) Str::uuid();
            $hashedPassword = Hash::make($password);

            // Attempt 1: Native Pterodactyl UserCreationService
            if (class_exists(\Pterodactyl\Services\Users\UserCreationService::class)) {
                try {
                    /** @var \Pterodactyl\Services\Users\UserCreationService $creator */
                    $creator = app(\Pterodactyl\Services\Users\UserCreationService::class);
                    $user = $creator->handle([
                        'email' => $email,
                        'username' => mb_strtolower($username),
                        'name_first' => $firstname,
                        'name_last' => $lastname,
                        'password' => $password,
                        'root_admin' => false,
                        'language' => 'en',
                    ]);
                } catch (\Throwable $svcErr) {
                    Log::warning('[UserRegistration] UserCreationService handled with exception: ' . $svcErr->getMessage() . '. Falling back to direct model creation.');
                    $user = null;
                }
            }

            // Attempt 2: Eloquent Model creation (with safe method checking)
            if (!$user && class_exists(User::class)) {
                try {
                    $userData = [
                        'uuid' => $userUuid,
                        'email' => $email,
                        'username' => mb_strtolower($username),
                        'name_first' => $firstname,
                        'name_last' => $lastname,
                        'password' => $hashedPassword,
                        'root_admin' => false,
                        'language' => 'en',
                    ];

                    if (Schema::hasColumn('users', 'language_set')) {
                        $userData['language_set'] = false;
                    }
                    if (Schema::hasColumn('users', 'use_totp')) {
                        $userData['use_totp'] = false;
                    }
                    if (Schema::hasColumn('users', 'totp_secret')) {
                        $userData['totp_secret'] = null;
                    }
                    if (Schema::hasColumn('users', 'gravatar')) {
                        $userData['gravatar'] = true;
                    }

                    $model = new User();
                    $model->forceFill($userData);
                    if (method_exists($model, 'skipValidation')) {
                        $model->skipValidation();
                    }
                    $model->save();
                    $user = $model;
                } catch (\Throwable $elErr) {
                    Log::warning('[UserRegistration] Eloquent save failed: ' . $elErr->getMessage() . '. Falling back to direct database insertion.');
                    $user = null;
                }
            }

            // Attempt 3: Direct Database Table Insertion (guaranteed fallback)
            if (!$user) {
                $now = now();
                $insertData = [
                    'uuid' => $userUuid,
                    'email' => $email,
                    'username' => mb_strtolower($username),
                    'name_first' => $firstname,
                    'name_last' => $lastname,
                    'password' => $hashedPassword,
                    'root_admin' => 0,
                    'language' => 'en',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                if (Schema::hasColumn('users', 'language_set')) {
                    $insertData['language_set'] = 0;
                }
                if (Schema::hasColumn('users', 'use_totp')) {
                    $insertData['use_totp'] = 0;
                }
                if (Schema::hasColumn('users', 'totp_secret')) {
                    $insertData['totp_secret'] = null;
                }
                if (Schema::hasColumn('users', 'gravatar')) {
                    $insertData['gravatar'] = 1;
                }
                if (Schema::hasColumn('users', 'remember_token')) {
                    $insertData['remember_token'] = null;
                }

                $newId = DB::table('users')->insertGetId($insertData);
                $user = class_exists(User::class) ? User::find($newId) : null;
                if (!$user) {
                    $user = (object) array_merge($insertData, ['id' => $newId]);
                }
            }

            // Auto-login user if enabled and user is an Authenticatable instance
            $autoLoggedIn = false;
            if (!empty($settings['auto_login']) && $user instanceof \Illuminate\Contracts\Auth\Authenticatable) {
                try {
                    Auth::guard('web')->login($user, true);
                    if ($request->hasSession()) {
                        $request->session()->regenerate();
                    }
                    $autoLoggedIn = true;
                } catch (\Throwable $authErr) {
                    Log::info('[UserRegistration] Auto-login bypassed: ' . $authErr->getMessage());
                }
            }

            // Log successful registration attempt
            $this->settingsService->logAttempt([
                'user_id' => $user->id ?? null,
                'username' => $user->username ?? $username,
                'email' => $user->email ?? $email,
                'name_first' => $firstname,
                'name_last' => $lastname,
                'ip_address' => $ip,
                'status' => 'success',
                'details' => 'User account registered successfully.',
                'user_agent' => $userAgent,
            ]);

            return response()->json([
                'success' => true,
                'message' => $autoLoggedIn 
                    ? 'Account created successfully! Logging you in...' 
                    : 'Account created successfully! Redirecting to login...',
                'redirect' => $autoLoggedIn ? '/' : '/auth/login',
                'auto_logged_in' => $autoLoggedIn,
                'user' => [
                    'id' => $user->id ?? null,
                    'username' => $user->username ?? $username,
                    'email' => $user->email ?? $email,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('[UserRegistration] Critical registration exception: ' . $e->getMessage() . "\n" . $e->getTraceAsString());

            $this->settingsService->logAttempt([
                'username' => $username,
                'email' => $email,
                'ip_address' => $ip,
                'status' => 'failed',
                'details' => 'Server error: ' . $e->getMessage(),
                'user_agent' => $userAgent,
            ]);

            return response()->json([
                'error' => 'An error occurred while creating your account. Please contact an administrator if the issue persists.',
                'detail' => $e->getMessage(),
            ], 500);
        }
    }
}
