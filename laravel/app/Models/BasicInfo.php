<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BasicInfo extends Model
{
    use HasFactory;

    protected $table = 'basic_infos';

    protected $fillable = [
        'resume_id',
        'full_name',
        'email',
        'phone',
        'job_title',
        'professional_summary',
        'avatar',
        'location',
        'linkedin',
        'github',
        'website',
    ];

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }
}
