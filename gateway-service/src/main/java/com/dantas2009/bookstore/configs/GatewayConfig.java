package com.dantas2009.bookstore.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class GatewayConfig {

        @Bean
        RestTemplate template() {
                return new RestTemplate();
        }

}
