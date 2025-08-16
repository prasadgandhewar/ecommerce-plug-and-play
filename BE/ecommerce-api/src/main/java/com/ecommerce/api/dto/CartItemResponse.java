package com.ecommerce.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    
    private Long id;
    private String productId;
    private Integer quantity;
    private LocalDateTime createdAt;
    
    // Product details from MongoDB (populated by service layer)
    private ProductResponse product;
}
