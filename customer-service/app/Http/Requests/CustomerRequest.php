<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => [
                'required',
                'string',
                'min:5',
                'max:255'
            ],
            'identification' => [
                'required',
                'string',
                'unique:customers'
            ],
            'birth' => [
                'required',
                'date',
            ],
            'phone' => [
                'required',
                'string',
                'min:5',
                'max:255'
            ],
            'email' => [
                'required',
                'email',
                'unique:customers'
            ],
        ];

        if($this->isMethod('put')) {
            $rules['identification'] = [
                'required',
                'string',
            ];
            $rules['email'] = [
                'required',
                'email',
            ];
        }

        return $rules;
    }
}
