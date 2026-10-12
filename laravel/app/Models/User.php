<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'is_pro',
        'oauth_provider',
        'google_id',
        'google_avatar',
        'google_token',
        'google_refresh_token',
        'linkedin_id',
        'linkedin_avatar',
        'linkedin_token',
        'linkedin_refresh_token',
        'github_import_token',
        'github_import_login',
        'github_import_connected_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google_token',
        'google_refresh_token',
        'linkedin_token',
        'linkedin_refresh_token',
        'github_import_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'is_pro' => 'boolean',
            'github_import_connected_at' => 'datetime',
        ];
    }

    public function resumes()
    {
        return $this->hasMany(Resume::class);
    }

    public function adminProfile()
    {
        return $this->hasOne(Admin::class);
    }

    public function candidate()
    {
        return $this->hasOne(Candidate::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function blogPosts()
    {
        return $this->hasMany(BlogPost::class);
    }

    public function isAdmin(): bool
    {
        return (bool) $this->is_admin;
    }

    public function isPro(): bool
    {
        return (bool) $this->is_pro;
    }
}
