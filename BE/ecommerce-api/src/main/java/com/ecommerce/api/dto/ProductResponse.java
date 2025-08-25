package com.ecommerce.api.dto;

import com.ecommerce.api.entity.ProductSpecifications;
import com.ecommerce.api.entity.ProductVariation;
import com.ecommerce.api.entity.ProductReview;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private String id;
    private String sku;
    private String name;
    private String description;
    private String category;
    private String subCategory;
    private String brand;
    private BigDecimal price;
    private String currency;
    private Integer stockQuantity;
    private List<String> images = new ArrayList<>();
    private ProductSpecifications specifications;
    private List<ProductVariation> variations = new ArrayList<>();
    private List<ProductReview> reviews = new ArrayList<>();
    private Boolean isActive;
    private Double averageRating;
    private Integer totalReviews;
    private Integer totalStock;
    private String mainImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
