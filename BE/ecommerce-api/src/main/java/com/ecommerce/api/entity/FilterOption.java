package com.ecommerce.api.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterOption {
    
    private String name;
    private String type; // "string" or "range"
    private List<String> options; // For string type filters
    private Double minValue; // For range type filters
    private Double maxValue; // For range type filters
    private String unit; // Optional unit for range filters (e.g., "$", "lbs")
}
