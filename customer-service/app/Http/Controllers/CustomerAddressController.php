<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\CustomerAddressRequest;
use App\Http\Resources\CustomerAddressResource;
use App\Http\Services\CustomerAddressService;
use App\Http\Services\UserService;
use Illuminate\Validation\UnauthorizedException;

class CustomerAddressController extends Controller
{
    protected $customerAddressService;
    protected $userService;

    public function __construct(CustomerAddressService $customerAddressService, UserService $userService)
    {
        $this->customerAddressService = $customerAddressService;
        $this->userService = $userService;
    }

    public function store(CustomerAddressRequest $request)
    {
        try {
            if (!$request->hasHeader('Authorization')) {
                throw new UnauthorizedException('Unauthorized');
            }
            $user = $this->userService->fetchUserByToken($request->header('Authorization'));
            if ($user == null) {
                throw new UnauthorizedException('Unauthorized');
            }
            $customerAddress = $this->customerAddressService->createCustomerAddress($request->validated(), $user['id_user']);
            return new CustomerAddressResource($customerAddress);
        } catch (UnauthorizedException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            if (!$request->hasHeader('Authorization')) {
                throw new UnauthorizedException('Unauthorized');
            }
            $user = $this->userService->fetchUserByToken($request->header('Authorization'));
            if ($user == null) {
                throw new UnauthorizedException('Unauthorized');
            }
            $customerAddress = $this->customerAddressService->getCustomerAddressById($id, $user['id_customer']);
            return new CustomerAddressResource($customerAddress);
        } catch (UnauthorizedException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(CustomerAddressRequest $request, $id)
    {
        try {
            if (!$request->hasHeader('Authorization')) {
                throw new UnauthorizedException('Unauthorized');
            }
            $user = $this->userService->fetchUserByToken($request->header('Authorization'));
            if ($user == null) {
                throw new UnauthorizedException('Unauthorized');
            }
            $customerAddress = $this->customerAddressService->updateCustomerAddress($request->validated(), $id, $user['id_customer']);
            return new CustomerAddressResource($customerAddress);
        } catch (UnauthorizedException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            if (!$request->hasHeader('Authorization')) {
                throw new UnauthorizedException('Unauthorized');
            }
            $user = $this->userService->fetchUserByToken($request->header('Authorization'));
            if ($user == null) {
                throw new UnauthorizedException('Unauthorized');
            }
            $customerAddresses = $this->customerAddressService->getAllCustomerAddresses($user['id_customer']);
            return CustomerAddressResource::collection($customerAddresses);
        } catch (UnauthorizedException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
