package com.dantas2009.bookstore.auth.services;

import java.util.Date;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.dantas2009.bookstore.auth.models.AuthCode;
import com.dantas2009.bookstore.auth.models.Device;
import com.dantas2009.bookstore.auth.models.User;

@Service
public class AuthCodeService {
    @Value("${bookstore.security.authcode.expiration}")
    private long codeExpiration;

    public AuthCode generateCode(User user, Device device) {
        return AuthCode.builder()
                .user(user)
                .device(device)
                .code(randomCode())
                .expire_at(new Date(System.currentTimeMillis() + 600000))
                .expired(false)
                .revoked(false)
                .build();
    }

    private final Random random = new Random();
    private String randomCode() {
        return String.format("%06d", random.nextInt(1000000));
    }
}
