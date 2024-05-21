<?php

namespace App\Http\Services;

use Exception;
use GuzzleHttp\Client;

class UserService
{
    public function fetchUserByToken($token)
    {
        try {
            $client = new Client();
            $response = $client->request('GET', 'http://auth:8081/api/v1/user/customer', [
                'headers' => [
                    'Authorization' => $token,
                    'Accept' => 'application/json',
                ]
            ]);

            $user = json_decode($response->getBody(), true);

            return $user ?? null;
        } catch (Exception $e) {
            return null;
        }

        return null;
    }

    public function setCustomerId($token, $id_customer)
    {
        try {
            $client = new Client();
            $response = $client->request('PUT', 'http://auth:8081/api/v1/user/customer', [
                'headers' => [
                    'Authorization' => $token,
                    'Accept' => 'application/json',
                ],
                'body' => json_encode(['id_customer' => $id_customer])
            ]);

            $user = json_decode($response->getBody(), true);

            return $user ?? null;
        } catch (Exception $e) {
            return null;
        }

        return null;
    }
}
