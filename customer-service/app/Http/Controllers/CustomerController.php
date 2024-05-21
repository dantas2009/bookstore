<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\CustomerRequest;
use App\Http\Services\CustomerService;
use App\Http\Resources\CustomerResource;
use App\Http\Services\UserService;
use Illuminate\Validation\UnauthorizedException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

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
        try {
            if (!$request->hasHeader('Authorization')) {
                throw new UnauthorizedException('Unauthorized');
            }
            $user = $this->userService->fetchUserByToken($request->header('Authorization'));
            if ($user == null) {
                throw new UnauthorizedException('Unauthorized');
            }
            if ($user['id_customer'] != null) {
                throw new BadRequestException('Customer already exists');
            }
            $customer = $this->customerService->createCustomer($request->validated(), $user['id_user']);
            return new CustomerResource($customer);
        } catch (UnauthorizedException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        } catch (BadRequestException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            if (!$request->hasHeader('Authorization')) {
                throw new UnauthorizedException('Unauthorized');
            }
            $user = $this->userService->fetchUserByToken($request->header('Authorization'));
            if ($user == null) {
                throw new UnauthorizedException('Unauthorized');
            }
            $customer = $this->customerService->getCustomerById($user['id_customer']);
            return new CustomerResource($customer);
        } catch (UnauthorizedException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(CustomerRequest $request)
    {
        try {
            if (!$request->hasHeader('Authorization')) {
                throw new UnauthorizedException('Unauthorized');
            }
            $user = $this->userService->fetchUserByToken($request->header('Authorization'));
            if ($user == null) {
                throw new UnauthorizedException('Unauthorized');
            }
            $customer = $this->customerService->updateCustomer($user['id_customer'], $request->validated());
            return new CustomerResource($customer);
        } catch (UnauthorizedException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
