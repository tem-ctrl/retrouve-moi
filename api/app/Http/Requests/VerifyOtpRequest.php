<?php

namespace App\Http\Requests;

class VerifyOtpRequest extends ApiFormRequest
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
            'phone' => ['required', 'string', 'regex:/^\+?[1-9]\d{1,14}$/'],
            'token' => ['required', 'string', 'size:6'],
        ];
    }
}
