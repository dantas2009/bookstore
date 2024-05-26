package com.dantas2009.bookstore.auth.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dantas2009.bookstore.auth.models.Token;
import com.dantas2009.bookstore.auth.repositories.TokenRepository;

import java.util.Date;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Value("${bookstore.security.jwt.secret}")
    private String secretKey;
    @Value("${bookstore.security.jwt.expiration}")
    private long jwtExpiration;
    @Value("${bookstore.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    @Autowired
    private TokenRepository tokenRepository;

    public String extractUsername(String token) {
        return JWT.require(Algorithm.HMAC256(secretKey))
                .withIssuer("auth-api")
                .build()
                .verify(token)
                .getSubject();
    }

    public String generateToken(UserDetails userDetails) {
        return buildToken(userDetails, jwtExpiration);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(userDetails, refreshExpiration);
    }

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

    private String buildToken(UserDetails userDetails, long expiration) {
        return JWT.create()
                .withIssuer("auth-api")
                .withSubject(userDetails.getUsername())
                .withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
                .sign(Algorithm.HMAC256(secretKey));
    }

    private void revokeToken(Token token) {
        token.setRevoked(true);
        token.setExpired(true);
        tokenRepository.save(token);
    }
}