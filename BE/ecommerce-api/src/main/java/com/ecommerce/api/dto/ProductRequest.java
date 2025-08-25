package com.ecommerce.api.dto;

import com.ecommerce.api.entity.ProductSpecifications;
import com.ecommerce.api.entity.ProductVariation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "SKU is required")
    @Size(max = 50)
    private String sku;

    @NotBlank(message = "Product name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 1000)
    private String description;

    @Size(max = 50)
    private String category;

    @Size(max = 50)
    private String subCategory;

    @Size(max = 50)
    private String brand;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @Size(max = 3)
    private String currency = "USD";

    @NotNull(message = "Stock quantity is required")
    private Integer stockQuantity = 0;

    private List<String> images = new ArrayList<>();

    private ProductSpecifications specifications;

    private List<ProductVariation> variations = new ArrayList<>();

    private Boolean isActive = true;
}
