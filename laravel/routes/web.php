<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\ResumeController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\TemplateController;
use Illuminate\Support\Facades\Route;

// Public Pages
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/templates', [TemplateController::class, 'index'])->name('templates.index');
Route::post('/subscribe', [SubscriberController::class, 'subscribe'])->name('newsletter.subscribe');

// Blog
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

// Contact & Legal
Route::get('/contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');
Route::get('/privacy', [LegalController::class, 'privacy'])->name('privacy');
Route::get('/terms', [LegalController::class, 'terms'])->name('terms');

// Authentication
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);

    // Social OAuth
    Route::get('/auth/google', [\App\Http\Controllers\SocialAuthController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('/auth/google/callback', [\App\Http\Controllers\SocialAuthController::class, 'handleGoogleCallback']);
    Route::get('/auth/linkedin', [\App\Http\Controllers\SocialAuthController::class, 'redirectToLinkedin'])->name('auth.linkedin');
    Route::get('/auth/linkedin/callback', [\App\Http\Controllers\SocialAuthController::class, 'handleLinkedinCallback']);
});
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Guest & Starter Editor
Route::get('/editor', [ResumeController::class, 'guestEditor'])->name('editor');
Route::get('/editor.html', function () { return redirect()->route('editor'); });
Route::get('/editor/guest', [ResumeController::class, 'guestEditor'])->name('editor.guest');
Route::get('/resumes/create', [ResumeController::class, 'create'])->name('resumes.create');

// Authenticated App Routes
Route::middleware('auth')->group(function () {
    // Resumes Dashboard
    Route::get('/resumes', [ResumeController::class, 'index'])->name('resumes.index');
    Route::get('/dashboard', [ResumeController::class, 'index'])->name('dashboard');

    // Editor & Resume Operations
    Route::get('/resumes/{resume}/edit', [ResumeController::class, 'edit'])->name('resumes.edit');
    Route::put('/resumes/{resume}', [ResumeController::class, 'update'])->name('resumes.update');
    Route::patch('/resumes/{resume}', [ResumeController::class, 'update']);
    Route::post('/resumes/{resume}/photo', [ResumeController::class, 'uploadPhoto'])->name('resumes.photo');
    Route::post('/resumes/{resume}/duplicate', [ResumeController::class, 'duplicate'])->name('resumes.duplicate');
    Route::delete('/resumes/{resume}', [ResumeController::class, 'destroy'])->name('resumes.destroy');

    // Account Settings
    Route::get('/account', [AccountController::class, 'index'])->name('account.index');
    Route::put('/account/profile', [AccountController::class, 'updateProfile'])->name('account.profile');
    Route::put('/account/password', [AccountController::class, 'updatePassword'])->name('account.password');
    Route::delete('/account', [AccountController::class, 'destroy'])->name('account.destroy');

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
});

// Admin Backoffice
Route::prefix('admin')->middleware(['auth', 'admin'])->as('admin.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [\App\Http\Controllers\Admin\AdminUserController::class, 'index'])->name('users.index');
    Route::patch('/users/{user}/toggle-pro', [\App\Http\Controllers\Admin\AdminUserController::class, 'togglePro'])->name('users.toggle-pro');
    Route::patch('/users/{user}/toggle-admin', [\App\Http\Controllers\Admin\AdminUserController::class, 'toggleAdmin'])->name('users.toggle-admin');
});
