package com.dantas2009.bookstore.user;

import java.util.NoSuchElementException;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import com.dantas2009.bookstore.auth.response.AuthenticationCustomerResponse;
import com.dantas2009.bookstore.repositories.UserRepository;
import com.dantas2009.bookstore.services.JwtService;
import com.dantas2009.bookstore.user.request.CustomerRequest;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthenticationCustomerResponse getCustomerIdByToken(HttpServletRequest httpRequest) {
        final String authHeader = httpRequest.getHeader(HttpHeaders.AUTHORIZATION);
        final String accessToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new NoSuchElementException("Get customer: Invalid token");
        }

        accessToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(accessToken);
        if (userEmail != null) {
            var user = this.userRepository.findByEmail(userEmail).orElseThrow();

            if (jwtService.isTokenValid(accessToken, user)) {
                return AuthenticationCustomerResponse.builder()
                        .id_customer(user.getIdCustomer())
                        .email(user.getEmail())
                        .build();
            }
        }
        throw new NoSuchElementException("Get customer: Invalid token");
    }

    public AuthenticationCustomerResponse setCustomerIdByToken(HttpServletRequest httpRequest, CustomerRequest request) {
        final String authHeader = httpRequest.getHeader(HttpHeaders.AUTHORIZATION);
        final String accessToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new NoSuchElementException("Set customer: Invalid token");
        }

        accessToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(accessToken);
        if (userEmail != null) {
            var user = this.userRepository.findByEmail(userEmail).orElseThrow();

            if (jwtService.isTokenValid(accessToken, user)) {
                String idCustomerStr = request.getId_customer();
                Integer idCustomer = idCustomerStr == null ? null : Integer.parseInt(idCustomerStr);
                user.setIdCustomer(idCustomer);
                this.userRepository.save(user);
                return AuthenticationCustomerResponse.builder()
                        .id_customer(user.getIdCustomer())
                        .email(user.getEmail())
                        .build();
            }
        }
        throw new NoSuchElementException("Set customer: Invalid token");
    }

}
