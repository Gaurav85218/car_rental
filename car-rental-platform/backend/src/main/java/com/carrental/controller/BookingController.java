package com.carrental.controller;

import com.carrental.dto.BookingRequest;
import com.carrental.dto.BookingResponse;
import com.carrental.service.BookingService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        log.info("Create booking request from user: {}", userDetails.getUsername());

        Long userId = extractUserIdFromAuthentication(authentication);
        BookingResponse booking = bookingService.createBooking(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        log.info("Get booking by id: {}", id);
        BookingResponse booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        log.info("Get bookings for user: {}", userDetails.getUsername());

        Long userId = extractUserIdFromAuthentication(authentication);
        List<BookingResponse> bookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/host/bookings")
    public ResponseEntity<List<BookingResponse>> getHostBookings(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        log.info("Get bookings for host: {}", userDetails.getUsername());

        Long hostId = extractUserIdFromAuthentication(authentication);
        List<BookingResponse> bookings = bookingService.getBookingsByHostId(hostId);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        log.info("Cancel booking request from user: {}", userDetails.getUsername());

        Long userId = extractUserIdFromAuthentication(authentication);
        BookingResponse booking = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(booking);
    }

    private Long extractUserIdFromAuthentication(Authentication authentication) {
        // This is a placeholder - you need to implement proper user ID extraction
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // For now, return a dummy ID - implement proper logic based on your User entity
        return 1L; // This should be replaced with actual user ID extraction
    }
}
