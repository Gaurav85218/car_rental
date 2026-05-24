package com.carrental.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookedDateRangeResponse {
    private LocalDate startDate;  // ← must be LocalDate not String or Date
    private LocalDate endDate;
}