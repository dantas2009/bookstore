<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'name',
        'identification',
        'birth',
        'phone',
        'email',
    ];

    protected $table = 'customers';

    protected $with = ['address'];

    public function address()
    {
        return $this->hasMany(CustomerAddress::class, 'id_customer', 'id');
    }
}
