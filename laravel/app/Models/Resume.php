<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resume extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'template_id',
        'title',
        'name',
        'template',
        'color',
        'photo_path',
        'section_order',
        'typography',
        'public_profile_enabled',
        'public_profile_slug',
        'public_profile_meta_title',
        'public_profile_meta_description',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
        'section_order' => 'array',
        'typography' => 'array',
        'public_profile_enabled' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function templateModel()
    {
        return $this->belongsTo(Template::class, 'template_id');
    }

    public function basicInfo()
    {
        return $this->hasOne(BasicInfo::class);
    }

    public function experiences()
    {
        return $this->hasMany(Experience::class);
    }

    public function education()
    {
        return $this->hasMany(Education::class);
    }

    public function skills()
    {
        return $this->hasMany(Skill::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    public function languages()
    {
        return $this->hasMany(Language::class);
    }

    public function hobbies()
    {
        return $this->hasMany(Hobby::class);
    }
}
