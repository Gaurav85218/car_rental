package com.carrental.controller;

import com.carrental.dto.BookingRequest;
import com.carrental.dto.BookingResponse;
import com.carrental.security.CustomUserDetails;
import com.carrental.service.BookingService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

        // CHANGED: Direct cast to CustomUserDetails
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        log.info("Create booking request from user: {}", userDetails.getUsername());

        Long userId = userDetails.getId(); // OPTIMIZATION: Extract ID directly without helper method!
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
        // CHANGED: Direct cast to CustomUserDetails
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        log.info("Get bookings for user: {}", userDetails.getUsername());

        Long userId = userDetails.getId(); // OPTIMIZATION: Get ID directly
        List<BookingResponse> bookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/host/bookings")
    public ResponseEntity<List<BookingResponse>> getHostBookings(Authentication authentication) {
        // CHANGED: Direct cast to CustomUserDetails
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        log.info("Get bookings for host: {}", userDetails.getUsername());

        Long hostId = userDetails.getId(); // OPTIMIZATION: Get ID directly
        List<BookingResponse> bookings = bookingService.getBookingsByHostId(hostId);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {

        // CHANGED: Direct cast to CustomUserDetails
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        log.info("Cancel booking request from user: {}", userDetails.getUsername());

        Long userId = userDetails.getId(); // OPTIMIZATION: Get ID directly
        BookingResponse booking = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(booking);
    }
}