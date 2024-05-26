package com.dantas2009.bookstore.configs;

import java.util.List;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import com.dantas2009.bookstore.services.JwtService;

import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

  @Autowired
  private JwtService jwtService;

  public static class Config {
  }

  public AuthenticationFilter() {
    super(Config.class);
  }

  @Override
  public GatewayFilter apply(Config config) {
    return ((exchange, chain) -> {
      List<String> authHeaders = exchange.getRequest().getHeaders().getOrEmpty(HttpHeaders.AUTHORIZATION);
      if (authHeaders.isEmpty() || !authHeaders.get(0).startsWith("Bearer ")) {
        return handleUnauthorized(exchange);
      }

      String token = authHeaders.get(0).substring(7);
      if (!jwtService.isValid(token)) {
        return handleUnauthorized(exchange);
      }

      return chain.filter(exchange);
    });
  }

  private Mono<Void> handleUnauthorized(ServerWebExchange exchange) {
    var response = exchange.getResponse();
    response.setStatusCode(HttpStatus.UNAUTHORIZED);
    return response.setComplete();
  }
}