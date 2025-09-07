package com.ecommerce.api.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@Document(collection = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;

    @NotBlank(message = "SKU is required")
    @Size(max = 50)
    @Field("sku")
    private String sku;

    @NotBlank(message = "Product name is required")
    @Size(max = 100)
    @Field("name")
    private String name;

    @Size(max = 1000)
    @Field("description")
    private String description;

    @Size(max = 50)
    @Field("category")
    private String category;

    @Size(max = 50)
    @Field("subCategory")
    private String subCategory;

    @Size(max = 50)
    @Field("brand")
    private String brand;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Field("price")
    private BigDecimal price;

    @Size(max = 3)
    @Field("currency")
    private String currency = "USD";

    @NotNull(message = "Stock quantity is required")
    @Field("stockQuantity")
    private Integer stockQuantity = 0;

    @Field("images")
    private List<String> images = new ArrayList<>();

    @Field("specifications")
    private ProductSpecifications specifications;

    @Field("attributes")
    private Map<String, Object> attributes = new HashMap<>();

    @Field("variations")
    private List<ProductVariation> variations = new ArrayList<>();

    @Field("reviews")
    private List<ProductReview> reviews = new ArrayList<>();

    @Field("isActive")
    private Boolean isActive = true;

    @Field("specialProperties")
    private SpecialProperties specialProperties;

    // Computed fields
    private Double averageRating;
    private Integer totalReviews;

    @CreatedDate
    @Field("createdAt")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Field("updatedAt")
    private LocalDateTime updatedAt;

    // Helper methods
    public void addReview(ProductReview review) {
        if (this.reviews == null) {
            this.reviews = new ArrayList<>();
        }
        this.reviews.add(review);
        computeRatingStats();
    }

    public void addVariation(ProductVariation variation) {
        if (this.variations == null) {
            this.variations = new ArrayList<>();
        }
        this.variations.add(variation);
    }

    public void addImage(String imageUrl) {
        if (this.images == null) {
            this.images = new ArrayList<>();
        }
        this.images.add(imageUrl);
    }

    private void computeRatingStats() {
        if (this.reviews == null || this.reviews.isEmpty()) {
            this.averageRating = 0.0;
            this.totalReviews = 0;
            return;
        }

        List<ProductReview> approvedReviews = this.reviews.stream()
                .filter(review -> review.getIsApproved() != null && review.getIsApproved())
                .toList();

        this.totalReviews = approvedReviews.size();
        
        if (this.totalReviews > 0) {
            this.averageRating = approvedReviews.stream()
                    .mapToInt(ProductReview::getRating)
                    .average()
                    .orElse(0.0);
        } else {
            this.averageRating = 0.0;
        }
    }

    // Get main image (first image in the list)
    public String getMainImageUrl() {
        return (images != null && !images.isEmpty()) ? images.get(0) : null;
    }

    // Get total stock including variations
    public Integer getTotalStock() {
        int totalStock = this.stockQuantity != null ? this.stockQuantity : 0;
        
        if (variations != null) {
            totalStock += variations.stream()
                    .filter(variation -> variation.getIsActive() != null && variation.getIsActive())
                    .mapToInt(variation -> variation.getStockQuantity() != null ? variation.getStockQuantity() : 0)
                    .sum();
        }
        
        return totalStock;
    }
}
