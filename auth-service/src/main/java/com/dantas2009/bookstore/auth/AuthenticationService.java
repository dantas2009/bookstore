package com.dantas2009.bookstore.auth;

import com.dantas2009.bookstore.auth.request.AuthenticationCodeRequest;
import com.dantas2009.bookstore.auth.request.EmailRequest;
import com.dantas2009.bookstore.auth.response.AuthenticationResponse;
import com.dantas2009.bookstore.models.Device;
import com.dantas2009.bookstore.models.Token;
import com.dantas2009.bookstore.models.User;
import com.dantas2009.bookstore.repositories.AuthCodeRepository;
import com.dantas2009.bookstore.repositories.DeviceRepository;
import com.dantas2009.bookstore.repositories.TokenRepository;
import com.dantas2009.bookstore.repositories.UserRepository;
import com.dantas2009.bookstore.services.AuthCodeService;
import com.dantas2009.bookstore.services.JwtService;

import eu.bitwalker.useragentutils.UserAgent;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository userRepository;
  private final AuthCodeRepository authCodeRepository;
  private final TokenRepository tokenRepository;
  private final DeviceRepository deviceRepository;
  private final JwtService jwtService;
  private final AuthCodeService authCodeService;

  public AuthenticationCodeRequest emailRequest(HttpServletRequest httpRequest, EmailRequest request) {
    var user = userRepository.findByEmail(request.getEmail()).orElse(null);

    if (user == null) {
      var newUser = User.builder()
          .email(request.getEmail())
          .build();

      user = userRepository.save(newUser);
    }

    var device = saveUserDevice(httpRequest, user);

    revokeAllAuthCode(user);
    var authCode = authCodeService.generateCode(user, device);

    authCodeRepository.save(authCode);

    return AuthenticationCodeRequest.builder()
        .code(authCode.getCode())
        .build();
  }

  public AuthenticationResponse authenticatCode(HttpServletRequest httpRequest, AuthenticationCodeRequest request) {
    var authCode = authCodeRepository.findByCode(request.getCode()).orElse(null);

    if (authCode == null) {
      throw new NoSuchElementException("Invalid code");
    }

    revokeAllAuthCode(authCode.getUser());

    var jwtToken = jwtService.generateToken(authCode.getUser());
    var refreshToken = jwtService.generateRefreshToken(authCode.getUser());

    var device = getOrSaveDevice(httpRequest, authCode.getUser());

    saveUserToken(authCode.getUser(), device, jwtToken);
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .refreshToken(refreshToken)
        .build();
  }

  private void saveUserToken(User user, Device device, String jwtToken) {
    var token = Token.builder()
        .user(user)
        .device(device)
        .token(jwtToken)
        .expired(false)
        .revoked(false)
        .build();
    tokenRepository.save(token);
  }

  public AuthenticationResponse refreshToken(HttpServletRequest httpRequest) {
    final String authHeader = httpRequest.getHeader(HttpHeaders.AUTHORIZATION);
    final String refreshToken;
    final String userEmail;
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      throw new NoSuchElementException("Invalid token");
    }

    refreshToken = authHeader.replace("Bearer ", "");
    userEmail = jwtService.extractUsername(refreshToken);
    if (userEmail != null) {
      var user = this.userRepository.findByEmail(userEmail).orElseThrow();

      if (jwtService.isTokenValid(refreshToken, user)) {
        var accessToken = jwtService.generateToken(user);
        var device = getOrSaveDevice(httpRequest, user);
        saveUserToken(user, device, accessToken);

        return AuthenticationResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .build();
      }
    }
    throw new NoSuchElementException("Invalid token");
  }

  private void revokeAllAuthCode(User user) {
    var validAuthCodeList = authCodeRepository.findAllValidAuthCodeByUser(user.getId());
    if (validAuthCodeList.isEmpty()) {
      return;
    }
    validAuthCodeList.forEach(authCode -> {
      authCode.setExpired(true);
      authCode.setRevoked(true);
    });
    authCodeRepository.saveAll(validAuthCodeList);
  }

  private Device saveUserDevice(HttpServletRequest httpRequest, User user) {
    Device device = getDevice(httpRequest, user);
    return deviceRepository.save(device);
  }

  private Device getOrSaveDevice(HttpServletRequest httpRequest, User user) {
    Device newDevice = getDevice(httpRequest, user);
    List<Device> devices = deviceRepository.findAllValidDeviceByUser(user.getId());

    for (Device device : devices) {
      if (device.getDevice_name().equals(newDevice.getDevice_name())
          && device.getDevice_os().equals(newDevice.getDevice_os())
          && device.getBrowser().equals(newDevice.getBrowser())) {
        return device;
      }
    }

    return deviceRepository.save(newDevice);
  }

  private Device getDevice(HttpServletRequest httpRequest, User user) {
    UserAgent userAgent = UserAgent.parseUserAgentString(httpRequest.getHeader("User-Agent"));
    return Device.builder()
        .user(user)
        .device_name(userAgent.getOperatingSystem().getDeviceType().getName())
        .device_os(userAgent.getOperatingSystem().getName())
        .browser(userAgent.getBrowser().getName())
        .ip_address(httpRequest.getRemoteAddr())
        .build();
  }
}