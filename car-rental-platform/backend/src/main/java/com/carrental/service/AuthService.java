package com.carrental.service;

import com.carrental.dto.AuthRequest;
import com.carrental.dto.AuthResponse;
import com.carrental.dto.RegisterRequest;
import com.carrental.dto.ForgotPasswordRequest;
import com.carrental.dto.ResetPasswordRequest;
import com.carrental.entity.User;
import com.carrental.entity.UserRole;
import com.carrental.repository.UserRepository;
import com.carrental.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender mailSender;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return AuthResponse.builder().message("Username already exists").build();
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder().message("Email already exists").build();
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .licenseNumber(request.getLicenseNumber())
                .role(request.getRole() != null ? request.getRole() : UserRole.CUSTOMER)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getUsername());

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(authentication.getName());

            return AuthResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .message("Login successful")
                    .build();

        } catch (AuthenticationException e) {
            log.error("Authentication failed: {}", e.getMessage());
            return AuthResponse.builder().message("Invalid username or password").build();
        }
    }

    public AuthResponse processForgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        // Generate 6-digit numeric string code
        String simpleCode = String.valueOf((int)((Math.random() * 900000) + 100000));
        user.setResetToken(simpleCode);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(3));
        userRepository.save(user);

        // FIX: Actually trigger the email delivery process!
        try {
            sendResetEmail(user.getEmail(), simpleCode);
            log.info("Password reset numeric code cleanly sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send mail via SMTP server: {}", e.getMessage());
            throw new RuntimeException("Failed to dispatch verification email.");
        }

        return AuthResponse.builder()
                .message("A simple verification code has been sent to your registered email address.")
                .build();
    }

    public AuthResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired verification code"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return AuthResponse.builder().message("Verification code has expired").build();
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return AuthResponse.builder().message("Password updated successfully.").build();
    }

    public void sendResetEmail(String toEmail, String simpleCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("gaurav81521@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Your Reset Code");
        message.setText("Your password reset code is: " + simpleCode);

        mailSender.send(message);
    }
}