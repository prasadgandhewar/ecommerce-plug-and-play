package com.ecommerce.api.dto;

import com.ecommerce.api.entity.ProductVariation;
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
    private String variationSku;
    private Integer quantity;
    private LocalDateTime createdAt;
    
    // Product details from MongoDB (populated by service layer)
    private ProductResponse product;
    private ProductVariation selectedVariation;
}
