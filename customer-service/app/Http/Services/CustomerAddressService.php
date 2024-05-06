<?php

namespace App\Http\Services;

use App\Models\CustomerAddress;

class CustomerAddressService
{
    public function getCustomerAddressById($id)
    {
        return CustomerAddress::findOrFail($id);
    }

    public function createCustomerAddress($data)
    {
        return CustomerAddress::create($data);
    }

    public function updateCustomerAddress($data, $id)
    {
        $customerAddress = CustomerAddress::findOrFail($id);
        $customerAddress->update($data);
        return $customerAddress;
    }
}
