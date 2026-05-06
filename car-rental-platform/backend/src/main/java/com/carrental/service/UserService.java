package com.carrental.service;

import com.carrental.entity.User;
import java.util.Optional;

public interface UserService {
    User findByUsername(String username);
    Optional<User> getUserById(Long id);
    // Add other methods as needed for your AutoMart project
}