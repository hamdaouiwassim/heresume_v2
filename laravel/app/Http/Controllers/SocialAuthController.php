<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to Google OAuth provider.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle callback from Google OAuth.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            return redirect()->route('login')->with('error', 'Google authentication failed or was cancelled.');
        }

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            $user->update([
                'google_id' => $googleUser->getId(),
                'google_avatar' => $googleUser->getAvatar(),
                'google_token' => $googleUser->token,
                'google_refresh_token' => $googleUser->refreshToken ?? $user->google_refresh_token,
                'oauth_provider' => $user->oauth_provider ?? 'google',
            ]);
        } else {
            $user = User::create([
                'name' => $googleUser->getName() ?? 'User',
                'email' => $googleUser->getEmail(),
                'password' => null,
                'oauth_provider' => 'google',
                'google_id' => $googleUser->getId(),
                'google_avatar' => $googleUser->getAvatar(),
                'google_token' => $googleUser->token,
                'google_refresh_token' => $googleUser->refreshToken,
                'email_verified_at' => now(),
            ]);
        }

        Auth::login($user, true);

        return redirect()->intended(route('resumes.index'));
    }

    /**
     * Redirect to LinkedIn OAuth provider.
     */
    public function redirectToLinkedin()
    {
        return Socialite::driver('linkedin-openid')->redirect();
    }

    /**
     * Handle callback from LinkedIn OAuth.
     */
    public function handleLinkedinCallback()
    {
        try {
            $linkedinUser = Socialite::driver('linkedin-openid')->user();
        } catch (\Throwable $e) {
            return redirect()->route('login')->with('error', 'LinkedIn authentication failed or was cancelled.');
        }

        $user = User::where('linkedin_id', $linkedinUser->getId())
            ->orWhere('email', $linkedinUser->getEmail())
            ->first();

        if ($user) {
            $user->update([
                'linkedin_id' => $linkedinUser->getId(),
                'linkedin_avatar' => $linkedinUser->getAvatar(),
                'linkedin_token' => $linkedinUser->token,
                'linkedin_refresh_token' => $linkedinUser->refreshToken ?? $user->linkedin_refresh_token,
                'oauth_provider' => $user->oauth_provider ?? 'linkedin',
            ]);
        } else {
            $user = User::create([
                'name' => $linkedinUser->getName() ?? 'User',
                'email' => $linkedinUser->getEmail(),
                'password' => null,
                'oauth_provider' => 'linkedin',
                'linkedin_id' => $linkedinUser->getId(),
                'linkedin_avatar' => $linkedinUser->getAvatar(),
                'linkedin_token' => $linkedinUser->token,
                'linkedin_refresh_token' => $linkedinUser->refreshToken,
                'email_verified_at' => now(),
            ]);
        }

        Auth::login($user, true);

        return redirect()->intended(route('resumes.index'));
    }
}
