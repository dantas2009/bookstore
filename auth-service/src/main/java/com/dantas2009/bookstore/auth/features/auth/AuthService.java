package com.dantas2009.bookstore.auth.features.auth;

import com.dantas2009.bookstore.auth.features.auth.response.AuthResponse;
import com.dantas2009.bookstore.auth.features.auth.response.CodeResponse;
import com.dantas2009.bookstore.auth.models.AuthCode;
import com.dantas2009.bookstore.auth.models.Device;
import com.dantas2009.bookstore.auth.models.Token;
import com.dantas2009.bookstore.auth.models.User;
import com.dantas2009.bookstore.auth.queue.kafka.producer.AuthCodeMessage;
import com.dantas2009.bookstore.auth.queue.kafka.producer.AuthProducer;
import com.dantas2009.bookstore.auth.repositories.AuthCodeRepository;
import com.dantas2009.bookstore.auth.repositories.TokenRepository;
import com.dantas2009.bookstore.auth.repositories.UserRepository;
import com.dantas2009.bookstore.auth.services.AuthCodeService;
import com.dantas2009.bookstore.auth.services.JwtService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AuthService {
  
  private final UserRepository userRepository;
  private final AuthCodeRepository authCodeRepository;
  private final TokenRepository tokenRepository;
  private final JwtService jwtService;
  private final AuthCodeService authCodeService;
  private final AuthProducer producer;

  public CodeResponse generateCode(User user, Device device) throws JsonProcessingException {
    revokeAllAuthCode(user.getId());
    var authCode = authCodeService.generateCode(user, device);

    authCodeRepository.save(authCode);

    var authCodeMessage = new AuthCodeMessage(authCode.getCode(), user.getEmail()).toString();
    producer.sendCode(authCode.getId().toString(), authCodeMessage);

    return CodeResponse.builder()
        .code(authCode.getCode())
        .build();
  }

  public AuthResponse authCode(AuthCode authCode, Device device) {
    revokeAllAuthCode(authCode.getUser().getId());

    var token = jwtService.generateToken(authCode.getUser());
    var refreshToken = jwtService.generateRefreshToken(authCode.getUser());

    saveUserToken(authCode.getUser(), device, token);
    return AuthResponse.builder()
        .accessToken(token)
        .refreshToken(refreshToken)
        .build();
  }

  public AuthResponse refreshToken(String refreshToken, User user, Device device) {
    if (!jwtService.isValid(refreshToken)) {
      throw new NoSuchElementException("Invalid refresh token");
    }

    var token = jwtService.generateToken(user);
    saveUserToken(user, device, token);
    return AuthResponse.builder()
        .accessToken(token)
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

  private void revokeAllAuthCode(Integer userId) {
    var validAuthCodeList = authCodeRepository.findAllValidAuthCodeByUser(userId);
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