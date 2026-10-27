<?php

namespace UserRegistration\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Uuid;
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

        // 3. Validate input fields
        $minPass = (int) ($settings['min_password_length'] ?? 8);
        $rules = [
            'firstname' => 'required|string|min:1|max:50',
            'lastname' => 'required|string|min:1|max:50',
            'username' => ['required', 'string', 'min:3', 'max:30', 'regex:/^[a-zA-Z0-9][a-zA-Z0-9_\-\.]*[a-zA-Z0-9]$/'],
            'email' => 'required|string|email|max:191',
            'password' => "required|string|min:{$minPass}|confirmed",
        ];

        if (!empty($settings['require_terms'])) {
            $rules['terms'] = 'accepted';
        }

        $validator = Validator::make($request->all(), $rules, [
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

        $email = strtolower(trim($request->input('email')));
        $username = trim($request->input('username'));
        $firstname = trim($request->input('firstname'));
        $lastname = trim($request->input('lastname'));
        $password = (string) $request->input('password');

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

        // 7. Check for existing username or email
        if (User::where('email', $email)->exists()) {
            return response()->json(['error' => 'An account with that email address already exists.'], 422);
        }

        if (User::whereRaw('LOWER(username) = ?', [mb_strtolower($username)])->exists()) {
            return response()->json(['error' => 'That username is already taken. Please choose another.'], 422);
        }

        // 8. Create the user
        try {
            $user = null;
            $userData = [
                'uuid' => Uuid::uuid4()->toString(),
                'email' => $email,
                'username' => mb_strtolower($username),
                'name_first' => $firstname,
                'name_last' => $lastname,
                'password' => Hash::make($password),
                'root_admin' => false,
                'language' => 'en',
                'language_set' => false,
                'use_totp' => false,
                'totp_secret' => null,
                'gravatar' => true,
            ];

            // Attempt using native Pterodactyl UserRepositoryInterface if available
            try {
                if (app()->bound(\Pterodactyl\Contracts\Repository\UserRepositoryInterface::class)) {
                    /** @var \Pterodactyl\Contracts\Repository\UserRepositoryInterface $repo */
                    $repo = app(\Pterodactyl\Contracts\Repository\UserRepositoryInterface::class);
                    $user = $repo->create($userData, false, true);
                }
            } catch (\Throwable $repoErr) {
                \Illuminate\Support\Facades\Log::warning('[UserRegistration] UserRepository error: ' . $repoErr->getMessage());
                $user = null;
            }

            // Fallback direct Eloquent creation
            if (!$user) {
                $user = new User();
                $user->forceFill($userData);
                $user->skipValidation()->save();
            }

            // Log successful registration
            $this->settingsService->logAttempt([
                'user_id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'name_first' => $user->name_first,
                'name_last' => $user->name_last,
                'ip_address' => $ip,
                'status' => 'success',
                'details' => 'User account registered successfully.',
                'user_agent' => $userAgent,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Account created successfully! Redirecting to login...',
                'redirect' => '/auth/login',
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                ],
            ]);
        } catch (\Throwable $e) {
            $this->settingsService->logAttempt([
                'username' => $username,
                'email' => $email,
                'ip_address' => $ip,
                'status' => 'failed',
                'details' => 'Server error: ' . $e->getMessage(),
                'user_agent' => $userAgent,
            ]);

            return response()->json([
                'error' => 'An error occurred while creating your account. Please try again later.',
            ], 500);
        }
    }
}
