<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class MissingPersonRequest extends ApiFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'age' => ['required', 'integer', 'between:1,120'],
            'gender' => ['required', 'string', Rule::in('male', 'female', 'other')],
            'photo' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'description' => ['required', 'string'],
            'last_seen_location' => ['required', 'string', 'max:255'],
            'last_seen_date' => ['required', 'date'],
            'region' => ['required', 'string', 'max:100'],
            'contact_phone' => ['required', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email'],
            'status' => ['nullable', 'string', Rule::in('missing', 'found', 'searching', 'urgent')],
            'is_urgent' => ['nullable', 'boolean'],
            'distinctive_signs' => ['nullable', 'string'],
            'height' => ['nullable', 'string', 'max:50'],
            'weight' => ['nullable', 'string', 'max:50'],
            'clothing_description' => ['nullable', 'string'],
            'reporter_name' => ['nullable', 'string', 'max:255'],
            'reporter_phone' => ['nullable', 'string', 'max:50'],
            'reporter_email' => ['nullable', 'email'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
