package com.dantas2009.bookstore.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

        @Bean
        SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
                return http.csrf(ServerHttpSecurity.CsrfSpec::disable).build();
        }
}
