package com.ecommerce.api.dto;

import com.ecommerce.api.entity.ProductVariation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    
    private Long id;
    private String productId;
    private String variationSku;
    private String productName;
    private String variationDescription;
    private String productImageUrl;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    
    // Product details from MongoDB (populated by service layer)
    private ProductResponse product;
    private ProductVariation selectedVariation;
}
