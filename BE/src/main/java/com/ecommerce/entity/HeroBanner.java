package com.ecommerce.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Document(collection = "hero-banner")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HeroBanner {
    
    @Id
    private String id;
    
    @Field("title")
    private String title;
    
    @Field("subtitle")
    private String subtitle;
    
    @Field("description")
    private String description;
    
    @Field("discount")
    private String discount;
    
    @Field("price")
    private String price;
    
    @Field("buttonText")
    private String buttonText;
    
    @Field("image")
    private String image;
    
    @Field("bgColor")
    private String bgColor;
    
    @Field("isActive")
    private Boolean isActive = true;
    
    @Field("sortOrder")
    private Integer sortOrder;
    
    @Field("locale")
    private String locale = "en";
    
    @Field("createdAt")
    private LocalDateTime createdAt;
    
    @Field("updatedAt")
    private LocalDateTime updatedAt;
}
