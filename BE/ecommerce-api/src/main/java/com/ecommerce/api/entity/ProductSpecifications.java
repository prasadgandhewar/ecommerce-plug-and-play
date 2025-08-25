package com.ecommerce.api.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSpecifications {

    private String connectivity;
    private Integer batteryLifeHours;
    private Boolean noiseCancellation;
    private List<String> colorOptions;
    private String weight;
    private String dimensions;
    private String warranty;
    private String material;
    private Map<String, Object> additionalSpecs;
}
