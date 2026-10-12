<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'resume_id',
        'experience_id',
        'name',
        'description',
        'technologies',
        'url',
        'startDate',
        'endDate',
    ];

    protected function casts(): array
    {
        return [
            'startDate' => 'date',
            'endDate' => 'date',
        ];
    }

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }

    public function experience()
    {
        return $this->belongsTo(Experience::class);
    }
}
