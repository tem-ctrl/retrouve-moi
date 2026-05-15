<?php

namespace App\Models;

use Database\Factories\SightingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(
    [
        'reporter_name',
        'reporter_phone',
        'reporter_email',
        'location',
        'sighting_date',
        'description',
        'missing_person_id',
        'user_id'
    ]
)]
class Sighting extends Model
{
    /** @use HasFactory<SightingFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'user_id' => 'integer'
        ];
    }

    /**
     * Get the missing person for this sighting.
     */
    public function missingPerson(): BelongsTo
    {
        return $this->belongsTo(MissingPerson::class);
    }

    /**
     * Get the user who reported this sighting.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
