package com.carrental.controller;

import com.carrental.dto.CarRequest;
import com.carrental.dto.CarResponse;
import com.carrental.security.CustomUserDetails;
import com.carrental.service.CarService;
import com.carrental.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CarController {

    @Autowired
    private CarService carService;


    @Autowired
    private UserService userService;

    @GetMapping("/browse")
    public ResponseEntity<List<CarResponse>> browseCars() {
        log.info("Browse all cars");
        List<CarResponse> cars = carService.getAllCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarResponse> getCarById(@PathVariable Long id) {
        log.info("Get car by id: {}", id);
        CarResponse car = carService.getCarById(id);
        return ResponseEntity.ok(car);
    }

    @PostMapping("/host/add")
    public ResponseEntity<CarResponse> addCar(
            @Valid @RequestPart("carRequest") CarRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            Authentication authentication) throws IOException {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        log.info("Add car request from host: {}", userDetails.getUsername());

        // Get user ID from authentication (you'll need to modify this based on your User entity)
        // For now, we'll use a placeholder - you should extract the actual user ID
        Long hostId = extractUserIdFromAuthentication(authentication);

        CarResponse car = carService.createCar(request, hostId, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(car);
    }

    @GetMapping("/host/my-cars")
    public ResponseEntity<List<CarResponse>> getHostCars(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        log.info("Get cars for host: {}", userDetails.getUsername());

        Long hostId = extractUserIdFromAuthentication(authentication);
        List<CarResponse> cars = carService.getCarsByHostId(hostId);
        return ResponseEntity.ok(cars);
    }

    @PutMapping("/host/{id}")
    public ResponseEntity<CarResponse> updateCar(
            @PathVariable Long id,
            @Valid @RequestPart("carRequest") CarRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            Authentication authentication) throws IOException {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        log.info("Update car request from host: {}", userDetails.getUsername());

        Long hostId = extractUserIdFromAuthentication(authentication);
        CarResponse car = carService.updateCar(id, request, hostId, images);
        return ResponseEntity.ok(car);
    }

    @DeleteMapping("/host/{id}")
    public ResponseEntity<Void> deleteCar(
            @PathVariable Long id,
            Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        log.info("Delete car request from host: {}", userDetails.getUsername());

        Long hostId = extractUserIdFromAuthentication(authentication);
        carService.deleteCar(id, hostId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/host/{carId}/images")
    public ResponseEntity<Void> removeImage(
            @PathVariable Long carId,
            @RequestParam String imageUrl,
            Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        log.info("Remove image from car: {}", carId);

        Long hostId = extractUserIdFromAuthentication(authentication);
        carService.removeImageFromCar(carId, imageUrl, hostId);
        return ResponseEntity.noContent().build();
    }

    private Long extractUserIdFromAuthentication(Authentication authentication) {
        // Cast to your custom User object to get the real ID (e.g., 5)
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getId();
        }
        // Fallback: If you don't have a custom UserDetails, you must
        // fetch the user from the database using the username
        return userService.findByUsername(authentication.getName()).getId();
    }
}
