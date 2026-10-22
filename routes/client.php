<?php

use Illuminate\Support\Facades\Route;
use UserRegistration\Http\Controllers\RegistrationController;

Route::get('/config', [RegistrationController::class, 'getPublicConfig']);
Route::post('/register', [RegistrationController::class, 'register']);
