<?php

namespace App\Http\Services;

use App\Models\CustomerAddress;

class CustomerAddressService
{
    public function getCustomerAddressById($id, $id_customer)
    {
        return CustomerAddress::where('id', $id)->where('id_customer', $id_customer)->first();
    }

    public function createCustomerAddress($data, $id_customer)
    {
        $data['id_customer'] = $id_customer;
        return CustomerAddress::create($data);
    }

    public function updateCustomerAddress($data, $id, $id_customer)
    {
        $customerAddress = CustomerAddress::where('id', $id)->where('id_customer', $id_customer)->first();
        $customerAddress->update($data);
        return $customerAddress;
    }

    public function getAllCustomerAddresses($id_customer)
    {
        return CustomerAddress::where('id_customer', $id_customer)->get();
    }
}
