<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(
    [
        'full_name',
        'email',
        'password',
        'phone',
        'avatar_url',
        'address',
        'city',
        'region',
        'bio',
    ]
)]
#[Hidden(['password'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * Get the missing persons reported by this user.
     */
    public function missingPersons()
    {
        return $this->hasMany(MissingPerson::class);
    }

    /**
     * Get the lost items reported by this user.
     */
    public function lostItems()
    {
        return $this->hasMany(LostItem::class);
    }

    /**
     * Get the sightings reported by this user.
     */
    public function sightings()
    {
        return $this->hasMany(Sighting::class);
    }
}
