package com.ecommerce.api.repository;

import com.ecommerce.api.entity.HeroBanner;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HeroBannerRepository extends MongoRepository<HeroBanner, String> {
    
    /**
     * Find all active hero banners for a specific locale, ordered by sort order
     */
    List<HeroBanner> findByIsActiveTrueAndLocaleOrderBySortOrder(String locale);
    
    /**
     * Find all active hero banners ordered by sort order (locale independent)
     */
    List<HeroBanner> findByIsActiveTrueOrderBySortOrder();
    
    /**
     * Find all hero banners for a specific locale ordered by sort order
     */
    List<HeroBanner> findByLocaleOrderBySortOrder(String locale);
}
