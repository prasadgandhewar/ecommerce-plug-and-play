package com.ecommerce.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterOptionDto {
    
    @NotBlank(message = "Filter name is required")
    private String name;
    
    @NotBlank(message = "Filter type is required")
    private String type; // "string" or "range"
    
    private List<String> options; // For string type filters, null for range type
    private Double minValue; // For range type filters
    private Double maxValue; // For range type filters
    private String unit; // Optional unit for range filters (e.g., "$", "lbs")
}
