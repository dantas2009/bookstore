<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\CustomerRequest;
use App\Http\Services\CustomerService;
use App\Http\Resources\CustomerResource;
use App\Http\Services\UserService;

class CustomerController extends Controller
{
    protected $customerService;
    protected $userService;

    public function __construct(CustomerService $customerService, UserService $userService)
    {
        $this->customerService = $customerService;
        $this->userService = $userService;
    }

    public function store(CustomerRequest $request)
    {
        $id_user = $this->userService->fetchUserIdByToken($request);
        $customer = $this->customerService->createCustomer($request->validated(), $id_user);
        return new CustomerResource($customer);
    }

    public function show($id)
    {
        $customer = $this->customerService->getCustomerById($id);
        return new CustomerResource($customer);
    }

    public function update(CustomerRequest $request, $id)
    {
        $customer = $this->customerService->updateCustomer($id, $request->validated());
        return new CustomerResource($customer);
    }
}
