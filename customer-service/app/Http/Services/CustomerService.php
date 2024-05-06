<?php

namespace App\Http\Services;

use App\Models\Customer;
use App\Repositories\CustomerRepository;

class CustomerService
{

    public function getCustomerById($id)
    {
        return Customer::findOrFail($id);
    }

    public function createCustomer($data, $id_user)
    {
        $data['id_user'] = $id_user;
        return Customer::create($data);
    }

    public function updateCustomer($id, $data)
    {
        $customer = Customer::findOrFail($id);
        $customer->update($data);
        return $customer;
    }
}
