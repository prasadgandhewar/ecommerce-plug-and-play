package com.ecommerce.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for returning special products grouped by type
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpecialProductsResponse {
    
    private List<ProductResponse> newArrivals;
    private List<ProductResponse> productsWithOffers;
    private List<ProductResponse> bestSellers;
}
