<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    protected $table = 'education';

    protected $fillable = [
        'resume_id',
        'institution',
        'degree',
        'start_date',
        'end_date',
        'is_present',
    ];

    protected function casts(): array
    {
        return [
            'is_present' => 'boolean',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }
}
