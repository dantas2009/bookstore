package com.dantas2009.bookstore.auth.features.user;

import org.springframework.stereotype.Service;

import com.dantas2009.bookstore.auth.features.auth.response.UserResponse;
import com.dantas2009.bookstore.auth.models.User;
import com.dantas2009.bookstore.auth.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponse authResponse(User user) {
        return UserResponse.builder()
                .id_user(user.getId())
                .id_customer(user.getIdCustomer())
                .email(user.getEmail())
                .build();
    }

    public UserResponse updateUser(User user) {
        this.userRepository.save(user);
        return UserResponse.builder()
                .id_user(user.getId())
                .id_customer(user.getIdCustomer())
                .email(user.getEmail())
                .build();
    }

    public User getUserByEmail(String email) {
        return this.userRepository.findByEmail(email).orElseThrow();
    }

}
