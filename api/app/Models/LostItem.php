<?php

namespace App\Models;

use Database\Factories\LostItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(
    [
        'item_type',
        'item_name',
        'item_category',
        'photo_url',
        'description',
        'location',
        'date_lost_found',
        'region',
        'contact_phone',
        'contact_email',
        'status',
        'report_type',
        'is_urgent',
        'reward',
        'document_type',
        'document_number',
        'owner_name',
        'brand',
        'color',
        'serial_number',
        'reporter_name',
        'reporter_phone',
        'reporter_email',
        'latitude',
        'longitude',
        'user_id'
    ]
)]
class LostItem extends Model
{
    /** @use HasFactory<LostItemFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_urgent' => 'boolean',
            'reward' => 'float',
            'latitude' => 'float',
            'longitude' => 'float',
            'user_id' => 'integer'
        ];
    }


    /**
     * Get the user who reported this lost item.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
