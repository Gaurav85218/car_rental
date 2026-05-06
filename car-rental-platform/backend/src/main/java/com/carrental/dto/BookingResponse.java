package com.carrental.dto;

import com.carrental.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long id;
    private Long userId;
    private Long carId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus status;
    private Double totalPrice;
    private Long createdAt;
    private CarResponse car;
}
