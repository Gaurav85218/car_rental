package com.carrental.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarResponse {

    private Long id;
    private String model;
    private Integer age;
    private Double pricePerDay;
    private List<String> imageUrls;
    private Long hostId;
    private Long createdAt;
    private Long updatedAt;
}
