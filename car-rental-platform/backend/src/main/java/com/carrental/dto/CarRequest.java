package com.carrental.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarRequest {

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be non-negative")
    private Integer age;

    @NotNull(message = "Price per day is required")
    @Min(value = 0, message = "Price must be positive")
    private Double pricePerDay;
}
