package com.dantas2009.bookstore.auth.features.auth;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.util.NoSuchElementException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dantas2009.bookstore.auth.features.auth.request.CodeRequest;
import com.dantas2009.bookstore.auth.features.auth.request.EmailRequest;
import com.dantas2009.bookstore.auth.features.auth.response.AuthResponse;
import com.dantas2009.bookstore.auth.features.auth.response.CodeResponse;
import com.dantas2009.bookstore.auth.models.AuthCode;
import com.dantas2009.bookstore.auth.models.Device;
import com.dantas2009.bookstore.auth.models.User;
import com.dantas2009.bookstore.auth.services.DeviceService;
import com.dantas2009.bookstore.auth.services.JwtService;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final JwtService jwtService;
  private final DeviceService deviceService;

  @PostMapping("/login/email")
  public ResponseEntity<CodeResponse> loginEmail(HttpServletRequest httpRequest,
      @RequestBody EmailRequest request) {
    try {
      final User user = authService.getOrSaveUserByEmail(request.getEmail());
      final Device device = deviceService.generateDevice(httpRequest, user);

      var response = authService.generateCode(user, device);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PostMapping("/login/code")
  public ResponseEntity<AuthResponse> authCode(HttpServletRequest httpRequest,
      @RequestBody CodeRequest request) {
    
    final AuthCode authCode = authService.getAuthCodeByCode(request.getCode());
    final Device device = deviceService.generateDevice(httpRequest, authCode.getUser());

    return ResponseEntity.ok(authService.authCode(authCode, device));
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<AuthResponse> refreshToken(HttpServletRequest httpRequest) {
    final String authHeader = httpRequest.getHeader(HttpHeaders.AUTHORIZATION);
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      throw new NoSuchElementException("Invalid refresh token");
    }

    final String refreshToken = authHeader.substring(7);
    final String email = jwtService.extractUsername(refreshToken);
    final User user = authService.getOrSaveUserByEmail(email);
    final Device device = deviceService.generateDevice(httpRequest, user);

    var response = authService.refreshToken(refreshToken, user, device);
    return ResponseEntity.ok(response);
  }

}