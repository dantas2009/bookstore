<?php

use App\Http\Controllers\CustomerAddressController;
use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return response()->json([
        'api' => 'Bookstore',
    ]);
});

Route::get('/customer/{id}', [CustomerController::class, 'show']);
Route::post('/customer', [CustomerController::class, 'store']);
Route::put('/customer/{id}', [CustomerController::class, 'update']);

Route::get('/customer/address/{id}', [CustomerAddressController::class, 'show']);
Route::post('/customer/address', [CustomerAddressController::class, 'store']);
Route::put('/customer/address/{id}', [CustomerAddressController::class, 'update']);
