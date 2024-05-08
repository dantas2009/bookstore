package com.dantas2009.bookstore.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dantas2009.bookstore.auth.response.AuthenticationCustomerResponse;
import com.dantas2009.bookstore.user.request.CustomerRequest;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @GetMapping("/customer")
    public ResponseEntity<AuthenticationCustomerResponse> getCustomerIdByToken(HttpServletRequest httpRequest) {
        return ResponseEntity.ok(service.getCustomerIdByToken(httpRequest));
    }

    @PutMapping("/customer")
    public ResponseEntity<AuthenticationCustomerResponse> setCustomerIdByToken(HttpServletRequest httpRequest,
            @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(service.setCustomerIdByToken(httpRequest, request));
    }

}
