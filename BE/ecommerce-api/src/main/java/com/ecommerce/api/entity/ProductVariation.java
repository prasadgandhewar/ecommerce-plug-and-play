package com.ecommerce.api.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariation {

    @NotBlank(message = "Variation SKU is required")
    @Size(max = 50)
    private String sku;

    @Size(max = 30)
    private String color;

    @Size(max = 30)
    private String size;

    @NotNull(message = "Variation price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Variation stock quantity is required")
    private Integer stockQuantity = 0;

    private String imageUrl;
    
    private Boolean isActive = true;
}
