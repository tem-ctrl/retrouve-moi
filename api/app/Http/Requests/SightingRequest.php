<?php

namespace App\Http\Requests;

class SightingRequest extends ApiFormRequest
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
            'reporter_name' => ['required', 'string', 'max:255'],
            'reporter_phone' => ['required', 'string', 'max:50'],
            'reporter_email' => ['nullable', 'email'],
            'location' => ['required', 'string', 'max:255'],
            'sighting_date' => ['required', 'date'],
            'description' => ['required', 'string'],
            'missing_person_id' => ['required', 'integer', 'exists:missing_people,id'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
