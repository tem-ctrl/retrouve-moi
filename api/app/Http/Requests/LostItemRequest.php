<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class LostItemRequest extends ApiFormRequest
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
            'item_type' => ['required', 'string', Rule::in('document', 'object', 'animal', 'vehicle', 'other')],
            'item_name' => ['required', 'string', 'max:255'],
            'item_category' => ['required', 'string', 'max:100'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'description' => ['required', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'date_lost_found' => ['required', 'date'],
            'region' => ['required', 'string', 'max:100'],
            'contact_phone' => ['required', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email'],
            'status' => ['nullable', 'string', Rule::in('lost', 'found', 'claimed')],
            'report_type' => ['required', 'string', Rule::in('lost', 'found')],
            'is_urgent' => ['nullable', 'boolean'],
            'reward' => ['nullable', 'string', 'max:255'],
            'document_type' => ['nullable', 'string', 'max:50'],
            'document_number' => ['nullable', 'string', 'max:100'],
            'owner_name' => ['nullable', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:50'],
            'serial_number' => ['nullable', 'string', 'max:100'],
            'reporter_name' => ['required', 'string', 'max:255'],
            'reporter_phone' => ['required', 'string', 'max:50'],
            'reporter_email' => ['nullable', 'email'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
