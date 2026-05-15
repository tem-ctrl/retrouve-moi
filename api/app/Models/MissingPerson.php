<?php

namespace App\Models;

use Database\Factories\MissingPersonFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(
    [
        'full_name',
        'age',
        'gender',
        'photo_url',
        'description',
        'last_seen_location',
        'last_seen_date',
        'region',
        'contact_phone',
        'contact_email',
        'status',
        'is_urgent',
        'distinctive_signs',
        'height',
        'weight',
        'clothing_description',
        'reporter_name',
        'reporter_phone',
        'reporter_email',
        'latitude',
        'longitude',
        'user_id'
    ]
)]
class MissingPerson extends Model
{
    /** @use HasFactory<MissingPersonFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'age' => 'integer',
            'is_urgent' => 'boolean',
            'height' => 'integer',
            'weight' => 'integer',
            'latitude' => 'float',
            'longitude' => 'float',
            'user_id' => 'integer'
        ];
    }

    /**
     * Get the user who reported this missing person.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the sightings for this missing person.
     */
    public function sightings(): HasMany
    {
        return $this->hasMany(Sighting::class);
    }
}
