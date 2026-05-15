package com.carrental.service;

import com.carrental.dto.BookingRequest;
import com.carrental.dto.BookingResponse;
import com.carrental.dto.CarResponse;
import com.carrental.entity.Booking;
import com.carrental.entity.BookingStatus;
import com.carrental.entity.Car;
import com.carrental.repository.BookingRepository;
import com.carrental.repository.CarRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CarService carService;

    public BookingResponse createBooking(BookingRequest request, Long userId) {
        // Validate dates
        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Start date cannot be in the past");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        long requestedDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (requestedDays > 5) {
            throw new IllegalArgumentException("Booking duration cannot exceed 5 days");
        }

        // Check car availability
        List<Booking> conflictingBookings = bookingRepository
                .findByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusNot(
                        request.getCarId(),
                        request.getEndDate(),
                        request.getStartDate(),
                        BookingStatus.CANCELLED
                );

        if (!conflictingBookings.isEmpty()) {
            throw new RuntimeException("Car is not available for the selected dates");
        }

        // Get car and calculate total price
        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days == 0) days = 1; // Minimum 1 day
        Double totalPrice = car.getPricePerDay() * days;

        // Create booking
        Booking booking = Booking.builder()
                .userId(userId)
                .carId(request.getCarId())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(BookingStatus.CONFIRMED)
                .totalPrice(totalPrice)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToResponse(booking);
    }

    public List<BookingResponse> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByCarId(Long carId) {
        return bookingRepository.findByCarId(carId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByHostId(Long hostId) {
        List<Car> hostCars = carRepository.findByHostId(hostId);
        List<Long> carIds = hostCars.stream().map(Car::getId).collect(Collectors.toList());

        return bookingRepository.findAll().stream()
                .filter(booking -> carIds.contains(booking.getCarId()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify ownership
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only cancel your own bookings");
        }

        // Check if booking can be cancelled
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        CarResponse carResponse = carService.getCarById(booking.getCarId());

        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .carId(booking.getCarId())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .status(booking.getStatus())
                .totalPrice(booking.getTotalPrice())
                .createdAt(booking.getCreatedAt())
                .car(carResponse)
                .build();
    }
}
