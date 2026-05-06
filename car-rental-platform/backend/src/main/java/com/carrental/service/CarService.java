package com.carrental.service;

import com.carrental.dto.CarRequest;
import com.carrental.dto.CarResponse;
import com.carrental.entity.Car;
import com.carrental.repository.CarRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CarService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public CarResponse createCar(CarRequest request, Long hostId, List<MultipartFile> images) throws IOException {
        // Validate image count
        if (images != null && images.size() > 4) {
            throw new IllegalArgumentException("Maximum 4 images allowed per car");
        }

        // Upload images to Cloudinary
        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(image);
                    imageUrls.add(imageUrl);
                }
            }
        }

        // Create car entity
        Car car = Car.builder()
                .model(request.getModel())
                .age(request.getAge())
                .pricePerDay(request.getPricePerDay())
                .imageUrls(imageUrls)
                .hostId(hostId)
                .build();

        Car savedCar = carRepository.save(car);
        return mapToResponse(savedCar);
    }

    public CarResponse updateCar(Long carId, CarRequest request, Long hostId, List<MultipartFile> newImages) throws IOException {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        // Verify ownership
        if (!car.getHostId().equals(hostId)) {
            throw new RuntimeException("Unauthorized: You can only update your own cars");
        }

        // Update basic info
        car.setModel(request.getModel());
        car.setAge(request.getAge());
        car.setPricePerDay(request.getPricePerDay());

        // Handle new images
        if (newImages != null && !newImages.isEmpty()) {
            if (car.getImageUrls().size() + newImages.size() > 4) {
                throw new IllegalArgumentException("Maximum 4 images allowed per car");
            }

            for (MultipartFile image : newImages) {
                if (!image.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(image);
                    car.getImageUrls().add(imageUrl);
                }
            }
        }

        Car updatedCar = carRepository.save(car);
        return mapToResponse(updatedCar);
    }

    public void deleteCar(Long carId, Long hostId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        // Verify ownership
        if (!car.getHostId().equals(hostId)) {
            throw new RuntimeException("Unauthorized: You can only delete your own cars");
        }

        carRepository.delete(car);
    }

    public CarResponse getCarById(Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        return mapToResponse(car);
    }

    public List<CarResponse> getAllCars() {
        return carRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CarResponse> getCarsByHostId(Long hostId) {
        return carRepository.findByHostId(hostId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void removeImageFromCar(Long carId, String imageUrl, Long hostId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        // Verify ownership
        if (!car.getHostId().equals(hostId)) {
            throw new RuntimeException("Unauthorized: You can only modify your own cars");
        }

        car.getImageUrls().remove(imageUrl);
        carRepository.save(car);
    }

    private CarResponse mapToResponse(Car car) {
        return CarResponse.builder()
                .id(car.getId())
                .model(car.getModel())
                .age(car.getAge())
                .pricePerDay(car.getPricePerDay())
                .imageUrls(car.getImageUrls())
                .hostId(car.getHostId())
                .createdAt(car.getCreatedAt())
                .updatedAt(car.getUpdatedAt())
                .build();
    }
}
