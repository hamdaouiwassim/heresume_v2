<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'resume_id',
        'name',
        'issuer',
        'date_obtained',
    ];

    protected function casts(): array
    {
        return [
            'date_obtained' => 'date',
        ];
    }

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }
}
