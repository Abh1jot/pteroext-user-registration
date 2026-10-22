<?php

use Illuminate\Support\Facades\Route;
use UserRegistration\Http\Controllers\AdminRegistrationController;

Route::get('/settings', [AdminRegistrationController::class, 'getSettings']);
Route::post('/settings', [AdminRegistrationController::class, 'updateSettings']);
Route::get('/logs', [AdminRegistrationController::class, 'getLogs']);
Route::delete('/logs', [AdminRegistrationController::class, 'clearLogs']);
Route::get('/stats', [AdminRegistrationController::class, 'getStats']);
