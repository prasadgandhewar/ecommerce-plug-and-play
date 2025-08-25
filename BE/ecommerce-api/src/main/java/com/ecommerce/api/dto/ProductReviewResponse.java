package com.ecommerce.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewResponse {

    private String userId;
    private String userName; // This will be populated from User service
    private Integer rating;
    private String comment;
    private LocalDateTime date;
    private Boolean isVerifiedPurchase;
    private Boolean isApproved;
}
