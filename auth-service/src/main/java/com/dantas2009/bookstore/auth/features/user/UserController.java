package com.dantas2009.bookstore.auth.features.user;

import java.util.NoSuchElementException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dantas2009.bookstore.auth.features.auth.response.UserResponse;
import com.dantas2009.bookstore.auth.features.user.request.UserRequest;
import com.dantas2009.bookstore.auth.models.User;
import com.dantas2009.bookstore.auth.services.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;
    private final JwtService jwtService;

    @GetMapping("/customer")
    public ResponseEntity<UserResponse> getUserByToken(HttpServletRequest httpRequest) {
        final String authHeader = httpRequest.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new NoSuchElementException("Invalid refresh token");
        }

        final String token = authHeader.substring(7);
        if (!jwtService.isValid(token)) {
            throw new NoSuchElementException("Invalid token");
        }

        final User user = service.getUserByEmail(jwtService.extractUsername(token));
        return ResponseEntity.ok(service.authResponse(user));
    }

    @PutMapping("/customer")
    public ResponseEntity<UserResponse> setUserByToken(HttpServletRequest httpRequest,
            @RequestBody UserRequest request) {
        final String authHeader = httpRequest.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new NoSuchElementException("Invalid refresh token");
        }

        final String token = authHeader.substring(7);
        final String email = jwtService.extractUsername(token);

        if (!jwtService.isValid(token)) {
            throw new NoSuchElementException("Invalid token");
        }

        final User user = service.getUserByEmail(email);
        Integer idCustomer = request.getId_customer() == null ? null : Integer.parseInt(request.getId_customer());
        user.setIdCustomer(idCustomer);

        return ResponseEntity.ok(service.updateUser(user));
    }

}
