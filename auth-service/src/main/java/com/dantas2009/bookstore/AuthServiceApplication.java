package com.dantas2009.bookstore;

import java.util.Collections;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(AuthServiceApplication.class);
		app.setDefaultProperties(Collections.singletonMap("server.port", "8081"));
	  	app.run(args);
	}

}
