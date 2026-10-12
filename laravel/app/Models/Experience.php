<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    protected $fillable = [
        'resume_id',
        'position',
        'company',
        'startDate',
        'endDate',
        'is_present',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'is_present' => 'boolean',
            'startDate' => 'date',
            'endDate' => 'date',
        ];
    }

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
