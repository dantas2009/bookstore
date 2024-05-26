package com.dantas2009.bookstore.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dantas2009.bookstore.models.Token;
import com.dantas2009.bookstore.repositories.TokenRepository;

import lombok.RequiredArgsConstructor;

import java.util.Date;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final TokenRepository tokenRepository;

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    public boolean isValid(String token) {
        try {
            var tokenStored = tokenRepository.findByAccessToken(token).orElseThrow();
            if(tokenStored.device.isRevoked()){
                revokeToken(tokenStored);
                return false;
            }

            token = tokenStored.getAccessToken();

            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT jwt = verifier.verify(token);
            if(jwt.getExpiresAt().before(new Date())){
                revokeToken(tokenStored);
                return false;
            }
            
            return true;
        } catch (JWTVerificationException | NoSuchElementException e) {
            return false;
        }
    }

    private void revokeToken(Token token) {
        token.setRevoked(true);
        token.setExpired(true);
        tokenRepository.save(token);
    }
}