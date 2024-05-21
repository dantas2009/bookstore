<?php

use App\Http\Controllers\CustomerAddressController;
use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return response()->json([
        'api' => 'Bookstore',
    ]);
});

Route::prefix('/api/v1')->group(function () {
    Route::prefix('/customers')->group(function () {
        Route::get('/', [CustomerController::class, 'show']);
        Route::post('/', [CustomerController::class, 'store']);
        Route::put('/', [CustomerController::class, 'update']);
        Route::prefix('/address')->group(function () {
            Route::get('/', [CustomerAddressController::class, 'index']);
            Route::get('/{id}', [CustomerAddressController::class, 'show']);
            Route::post('/', [CustomerAddressController::class, 'store']);
            Route::put('/{id}', [CustomerAddressController::class, 'update']);
        });
    });
});
