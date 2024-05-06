<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerAddressRequest extends FormRequest
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
        return [
            'id_customer' => [
                'required',
                'integer',
            ],
            'name' => [
                'required',
                'string',
            ],
            'address_1' => [
                'required',
                'string',
            ],
            'address_2' => [
                'nullable',
                'string',
            ],
            'city' => [
                'required',
                'string',
            ],
            'state' => [
                'required',
                'string',
            ],
            'country' => [
                'required',
                'string',
            ],
            'zipcode' => [
                'required',
                'string',
            ],
            'complement' => [
                'nullable',
                'string',
            ],
            'default' => [
                'boolean',
            ],
        ];
    }
}
