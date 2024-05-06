<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerAddressRequest;
use App\Http\Resources\CustomerAddressResource;
use App\Http\Services\CustomerAddressService;

class CustomerAddressController extends Controller
{
    protected $customerAddressService;
    protected $userService;

    public function __construct(CustomerAddressService $customerAddressService)
    {
        $this->customerAddressService = $customerAddressService;
    }

    public function store(CustomerAddressRequest $request)
    {
        $customerAddress = $this->customerAddressService->createCustomerAddress($request->validated());
        return new CustomerAddressResource($customerAddress);
    }

    public function show($id)
    {
        $customerAddress = $this->customerAddressService->getCustomerAddressById($id);
        return new CustomerAddressResource($customerAddress);
    }

    public function update(CustomerAddressRequest $request, $id)
    {
        $customerAddress = $this->customerAddressService->updateCustomerAddress($request->validated(), $id);
        return new CustomerAddressResource($customerAddress);
    }
}
