<?php

namespace App\Http\Services;

use Exception;
use GuzzleHttp\Client;

class UserService
{
    public function fetchUserIdByToken($request)
    {
        if ($request->hasHeader('Authorization')) {
            $authorizationHeader = $request->header('Authorization');
            try {
                $client = new Client();
                $response = $client->request('GET', 'http://auth:8080/auth/user', [
                    'headers' => [
                        'Authorization' => $authorizationHeader,
                        'Accept' => 'application/json',
                    ]
                ]);

                $user = json_decode($response->getBody(), true);

                return $user['id_user'] ?? null;
            } catch (Exception $e) {
                return null;
            }
        }
        return null;
    }
}
