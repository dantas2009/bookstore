<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerAddress extends Model
{
    use HasFactory;

    protected $table = 'customer_addresses';

    protected $fillable = [
        'id_customer',
        'name',
        'address_1',
        'address_2',
        'city',
        'state',
        'country',
        'zipcode',
        'complement',
    ];

}
