<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('ext_user_registrations_log')) {
            Schema::create('ext_user_registrations_log', function (Blueprint $table) {
                $table->id();
                $table->unsignedInteger('user_id')->nullable()->index();
                $table->string('username', 64)->index();
                $table->string('email', 191)->index();
                $table->string('name_first', 64)->nullable();
                $table->string('name_last', 64)->nullable();
                $table->string('ip_address', 45)->nullable()->index();
                $table->string('status', 32)->default('success'); // success, failed, blocked_domain, blocked_rate_limit, blocked_captcha
                $table->text('details')->nullable();
                $table->text('user_agent')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('ext_user_registration_settings')) {
            Schema::create('ext_user_registration_settings', function (Blueprint $table) {
                $table->string('key', 128)->primary();
                $table->longText('value')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ext_user_registrations_log');
        Schema::dropIfExists('ext_user_registration_settings');
    }
};
