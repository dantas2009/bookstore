package com.dantas2009.bookstore.auth;

import com.dantas2009.bookstore.auth.response.AuthenticationCodeResponse;
import com.dantas2009.bookstore.auth.response.AuthenticationResponse;
import com.dantas2009.bookstore.models.AuthCode;
import com.dantas2009.bookstore.models.Device;
import com.dantas2009.bookstore.models.Token;
import com.dantas2009.bookstore.models.User;
import com.dantas2009.bookstore.queue.kafka.producer.AuthProducer;
import com.dantas2009.bookstore.queue.kafka.producer.SendAuthCode;
import com.dantas2009.bookstore.repositories.AuthCodeRepository;
import com.dantas2009.bookstore.repositories.DeviceRepository;
import com.dantas2009.bookstore.repositories.TokenRepository;
import com.dantas2009.bookstore.repositories.UserRepository;
import com.dantas2009.bookstore.services.AuthCodeService;
import com.dantas2009.bookstore.services.JwtService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

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
  private final AuthProducer producer;
  private ObjectMapper objectMapper = new ObjectMapper();

  public AuthenticationCodeResponse emailRequest(User user, Device device) throws JsonProcessingException {
    revokeAllAuthCode(user);
    var authCode = authCodeService.generateCode(user, device);

    authCodeRepository.save(authCode);

    var sendAuthCode = new SendAuthCode(authCode.getCode(), user.getEmail());
    String authCodeJson = objectMapper.writeValueAsString(sendAuthCode);

    producer.sendCode(authCode.getId().toString(), authCodeJson);

    return AuthenticationCodeResponse.builder()
        .code(authCode.getCode())
        .build();
  }

  public AuthenticationResponse authenticatCode(AuthCode authCode, Device device) {
    revokeAllAuthCode(authCode.getUser());

    var jwtToken = jwtService.generateToken(authCode.getUser());
    var refreshToken = jwtService.generateRefreshToken(authCode.getUser());

    saveUserToken(authCode.getUser(), device, jwtToken);
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .refreshToken(refreshToken)
        .build();
  }

  public AuthenticationResponse refreshToken(String refreshToken, User user, Device device) {
    if (!jwtService.isTokenValid(refreshToken, user)) {
      throw new NoSuchElementException("Invalid refresh token");
    }

    var accessToken = jwtService.generateToken(user);
    saveUserToken(user, device, accessToken);
    return AuthenticationResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .build();
  }

  public User getOrSaveUserByEmail(String email) {
    var user = userRepository.findByEmail(email).orElse(null);
    if (user == null) {
      var newUser = User.builder()
          .email(email)
          .build();

      user = userRepository.save(newUser);
    }

    return user;
  }

  public AuthCode getAuthCodeByCode(String code) {
    return authCodeRepository.findByCode(code).orElseThrow();
  }

  public Device getOrSaveDevice(Device device) {
    List<Device> devices = deviceRepository.findAllValidDeviceByUser(device.getUser().getId());

    for (Device oldDevice : devices) {
      if (oldDevice.getDevice_name().equals(device.getDevice_name())
          && oldDevice.getDevice_os().equals(device.getDevice_os())
          && oldDevice.getBrowser().equals(device.getBrowser())) {
        return oldDevice;
      }
    }

    return deviceRepository.save(device);
  }

  private void saveUserToken(User user, Device device, String jwtToken) {
    var token = Token.builder()
        .user(user)
        .device(device)
        .accessToken(jwtToken)
        .expired(false)
        .revoked(false)
        .build();
    tokenRepository.save(token);
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
}