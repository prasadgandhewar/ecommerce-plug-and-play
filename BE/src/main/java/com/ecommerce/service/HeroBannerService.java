package com.ecommerce.service;

import com.ecommerce.entity.HeroBanner;
import com.ecommerce.repository.HeroBannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HeroBannerService {
    
    @Autowired
    private HeroBannerRepository heroBannerRepository;
    
    /**
     * Get all active hero banners for a specific locale
     * @param locale The locale (e.g., "en", "es")
     * @return List of active hero banners sorted by sortOrder
     */
    public List<HeroBanner> getActiveHeroBanners(String locale) {
        if (locale == null || locale.trim().isEmpty()) {
            locale = "en"; // Default to English
        }
        return heroBannerRepository.findByIsActiveTrueAndLocaleOrderBySortOrder(locale);
    }
    
    /**
     * Get all active hero banners regardless of locale
     * @return List of active hero banners sorted by sortOrder
     */
    public List<HeroBanner> getAllActiveHeroBanners() {
        return heroBannerRepository.findByIsActiveTrueOrderBySortOrder();
    }
    
    /**
     * Get all hero banners for a specific locale (including inactive)
     * @param locale The locale
     * @return List of hero banners sorted by sortOrder
     */
    public List<HeroBanner> getHeroBannersByLocale(String locale) {
        if (locale == null || locale.trim().isEmpty()) {
            locale = "en";
        }
        return heroBannerRepository.findByLocaleOrderBySortOrder(locale);
    }
    
    /**
     * Get a specific hero banner by ID
     * @param id The hero banner ID
     * @return Optional containing the hero banner if found
     */
    public Optional<HeroBanner> getHeroBannerById(String id) {
        return heroBannerRepository.findById(id);
    }
    
    /**
     * Get all hero banners
     * @return List of all hero banners
     */
    public List<HeroBanner> getAllHeroBanners() {
        return heroBannerRepository.findAll();
    }
}
