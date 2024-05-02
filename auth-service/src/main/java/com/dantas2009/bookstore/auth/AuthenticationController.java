package com.dantas2009.bookstore.auth;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dantas2009.bookstore.auth.request.AuthenticationCodeRequest;
import com.dantas2009.bookstore.auth.request.EmailRequest;
import com.dantas2009.bookstore.auth.response.AuthenticationResponse;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService service;

  @PostMapping("/login/email")
  public ResponseEntity<AuthenticationCodeRequest> loginEmail(HttpServletRequest httpRequest, @RequestBody EmailRequest request) {
    return ResponseEntity.ok(service.emailRequest(httpRequest, request));
  }

  @PostMapping("/login/code")
  public ResponseEntity<AuthenticationResponse> authCode(HttpServletRequest httpRequest, @RequestBody AuthenticationCodeRequest request) {
    return ResponseEntity.ok(service.authenticatCode(httpRequest, request));
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request) {
    return ResponseEntity.ok(service.refreshToken(request));
  }

}