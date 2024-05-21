package com.dantas2009.bookstore.auth;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.util.NoSuchElementException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dantas2009.bookstore.auth.request.AuthenticationCodeRequest;
import com.dantas2009.bookstore.auth.request.EmailRequest;
import com.dantas2009.bookstore.auth.response.AuthenticationCodeResponse;
import com.dantas2009.bookstore.auth.response.AuthenticationResponse;
import com.dantas2009.bookstore.models.Device;
import com.dantas2009.bookstore.services.JwtService;

import eu.bitwalker.useragentutils.UserAgent;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService service;
  private final JwtService jwtService;

  @PostMapping("/login/email")
  public ResponseEntity<AuthenticationCodeResponse> loginEmail(HttpServletRequest httpRequest,
      @RequestBody EmailRequest request) {
    var user = service.getOrSaveUserByEmail(request.getEmail());

    UserAgent userAgent = UserAgent.parseUserAgentString(httpRequest.getHeader("User-Agent"));
    var device = service.getOrSaveDevice(Device.builder()
        .user(user)
        .device_name(userAgent.getOperatingSystem().getDeviceType().getName())
        .device_os(userAgent.getOperatingSystem().getName())
        .browser(userAgent.getBrowser().getName())
        .ip_address(httpRequest.getRemoteAddr())
        .build());

    return ResponseEntity.ok(service.emailRequest(user, device));
  }

  @PostMapping("/login/code")
  public ResponseEntity<AuthenticationResponse> authCode(HttpServletRequest httpRequest,
      @RequestBody AuthenticationCodeRequest request) {
    var authCode = service.getAuthCodeByCode(request.getCode());

    UserAgent userAgent = UserAgent.parseUserAgentString(httpRequest.getHeader("User-Agent"));
    var device = service.getOrSaveDevice(Device.builder()
        .user(authCode.getUser())
        .device_name(userAgent.getOperatingSystem().getDeviceType().getName())
        .device_os(userAgent.getOperatingSystem().getName())
        .browser(userAgent.getBrowser().getName())
        .ip_address(httpRequest.getRemoteAddr())
        .build());

    return ResponseEntity.ok(service.authenticatCode(authCode, device));
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest httpRequest) {
    final String authHeader = httpRequest.getHeader(HttpHeaders.AUTHORIZATION);
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      throw new NoSuchElementException("Invalid refresh token");
    }

    final String refreshToken = authHeader.substring(7);
    final String email = jwtService.extractUsername(refreshToken);
    var user = service.getOrSaveUserByEmail(email);

    UserAgent userAgent = UserAgent.parseUserAgentString(httpRequest.getHeader("User-Agent"));
    var device = service.getOrSaveDevice(Device.builder()
        .user(user)
        .device_name(userAgent.getOperatingSystem().getDeviceType().getName())
        .device_os(userAgent.getOperatingSystem().getName())
        .browser(userAgent.getBrowser().getName())
        .ip_address(httpRequest.getRemoteAddr())
        .build());

    return ResponseEntity.ok(service.refreshToken(refreshToken, user, device));
  }

}