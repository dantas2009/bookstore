package com.dantas2009.bookstore.user;

import org.springframework.stereotype.Service;

import com.dantas2009.bookstore.auth.response.AuthenticationUserResponse;
import com.dantas2009.bookstore.models.User;
import com.dantas2009.bookstore.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public AuthenticationUserResponse authResponse(User user) {
        return AuthenticationUserResponse.builder()
                .id_user(user.getId())
                .id_customer(user.getIdCustomer())
                .email(user.getEmail())
                .build();
    }

    public AuthenticationUserResponse updateUser(User user) {
        this.userRepository.save(user);
        return AuthenticationUserResponse.builder()
                .id_user(user.getId())
                .id_customer(user.getIdCustomer())
                .email(user.getEmail())
                .build();
    }

    public User getUserByEmail(String email) {
        return this.userRepository.findByEmail(email).orElseThrow();
    }

}
