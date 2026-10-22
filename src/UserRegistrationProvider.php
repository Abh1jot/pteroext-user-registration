<?php

namespace UserRegistration;

use Pterodactyl\Extensions\ExtensionProvider;
use Pterodactyl\Services\Extensions\ExtensionSettingDefinition;
use Pterodactyl\Services\Extensions\ExtensionSettingsDefinition;
use Illuminate\Support\Facades\Route;
use UserRegistration\Http\Controllers\RegistrationController;
use UserRegistration\Http\Controllers\AdminRegistrationController;

class UserRegistrationProvider extends ExtensionProvider
{
    /**
     * Boot the User Registration extension.
     */
    public function boot(): void
    {
        $this->registerApiRoutes();
        $this->loadExtensionMigrations();
        $this->registerPublicRoutes();

        $this->registerPermissions('User Registration', [
            'manage' => 'Manage public registration settings, domain policies, and view registration audit logs',
        ]);

        if (class_exists(ExtensionSettingsDefinition::class) && class_exists(ExtensionSettingDefinition::class)) {
            $this->registerSettings(new ExtensionSettingsDefinition($this->settings(), [
                ExtensionSettingDefinition::make('enabled', 'toggle', true)
                    ->label('Enable Public Registration')
                    ->help('Allow new visitors to register their own accounts on the panel.')
                    ->field('toggle')
                    ->frontend(),
                ExtensionSettingDefinition::make('auto_login', 'toggle', true)
                    ->label('Automatic Login After Registration')
                    ->help('Instantly authenticate and log the user in upon successful registration.')
                    ->field('toggle')
                    ->frontend(),
                ExtensionSettingDefinition::make('require_terms', 'toggle', false)
                    ->label('Require Terms & Privacy Agreement')
                    ->help('Force users to check an agreement box before submitting their registration.')
                    ->field('toggle')
                    ->frontend(),
                ExtensionSettingDefinition::make('terms_url', 'text', '/terms')
                    ->label('Terms of Service URL')
                    ->frontend(),
                ExtensionSettingDefinition::make('privacy_url', 'text', '/privacy')
                    ->label('Privacy Policy URL')
                    ->frontend(),
                ExtensionSettingDefinition::make('block_disposable_emails', 'toggle', true)
                    ->label('Block Disposable & Temporary Emails')
                    ->help('Automatically block registrations using throwaway email domains (tempmail, 10minutemail, etc.).')
                    ->field('toggle')
                    ->frontend(),
                ExtensionSettingDefinition::make('bot_protection', 'select', 'none')
                    ->label('Bot Protection / Captcha')
                    ->field('select', [
                        ['value' => 'none', 'label' => 'None (Disabled)'],
                        ['value' => 'turnstile', 'label' => 'Cloudflare Turnstile'],
                        ['value' => 'recaptcha_v2', 'label' => 'Google reCAPTCHA v2'],
                        ['value' => 'recaptcha_v3', 'label' => 'Google reCAPTCHA v3'],
                    ])
                    ->frontend(),
                ExtensionSettingDefinition::make('captcha_site_key', 'text', '')
                    ->label('Captcha Site Key')
                    ->frontend(),
                ExtensionSettingDefinition::make('captcha_secret_key', 'text', '')
                    ->label('Captcha Secret Key'),
                ExtensionSettingDefinition::make('min_password_length', 'text', '8')
                    ->label('Minimum Password Length')
                    ->frontend(),
            ]));
        }
    }

    /**
     * Register public guest-accessible registration routes.
     * Ensures smooth registration access across all Pterodactyl router setups.
     */
    protected function registerPublicRoutes(): void
    {
        // Public API endpoints (rate limited to prevent spam)
        Route::middleware(['api', 'throttle:60,1'])->prefix('api/public/registration')->group(function () {
            Route::get('/config', [RegistrationController::class, 'getPublicConfig']);
            Route::post('/register', [RegistrationController::class, 'register']);
        });

        // Also register client extension routes for panel consistency
        Route::middleware(['web'])->prefix('api/client/extensions/user-registration')->group(function () {
            Route::get('/config', [RegistrationController::class, 'getPublicConfig']);
            Route::post('/register', [RegistrationController::class, 'register']);
        });
    }
}
