package com.carrental.controller;

import com.carrental.dto.AuthRequest;
import com.carrental.dto.AuthResponse;
import com.carrental.dto.RegisterRequest;
import com.carrental.dto.ForgotPasswordRequest;
import com.carrental.dto.ResetPasswordRequest;
import com.carrental.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@CrossOrigin(origins = {
        "https://car-rental-ruddy-sigma.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://localhost:19006"
})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register request for user: {}", request.getUsername());
        AuthResponse response = authService.register(request);

        if (response.getToken() != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        log.info("Login request for user: {}", request.getUsername());
        AuthResponse response = authService.login(request);

        if (response.getToken() != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // --- ENDPOINTS FOR FORGOT PASSWORD ---

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Received forgot-password request for email: {}", request.getEmail());
        try {
            AuthResponse response = authService.processForgotPassword(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(AuthResponse.builder().message(e.getMessage()).build());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Received reset-password request execution");
        try {
            AuthResponse response = authService.resetPassword(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(AuthResponse.builder().message(e.getMessage()).build());
        }
    }
}