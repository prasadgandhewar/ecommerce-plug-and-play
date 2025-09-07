package com.ecommerce.controller;

import com.ecommerce.entity.HeroBanner;
import com.ecommerce.service.HeroBannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hero-banners")
@CrossOrigin(origins = "*")
public class HeroBannerController {
    
    @Autowired
    private HeroBannerService heroBannerService;
    
    /**
     * Get all active hero banners for homepage
     * @param locale Optional locale parameter (defaults to "en")
     * @return List of active hero banners
     */
    @GetMapping
    public ResponseEntity<List<HeroBanner>> getActiveHeroBanners(
            @RequestParam(value = "locale", defaultValue = "en") String locale) {
        
        List<HeroBanner> heroBanners = heroBannerService.getActiveHeroBanners(locale);
        return ResponseEntity.ok(heroBanners);
    }
    
    /**
     * Get all active hero banners regardless of locale
     * @return List of all active hero banners
     */
    @GetMapping("/all")
    public ResponseEntity<List<HeroBanner>> getAllActiveHeroBanners() {
        List<HeroBanner> heroBanners = heroBannerService.getAllActiveHeroBanners();
        return ResponseEntity.ok(heroBanners);
    }
    
    /**
     * Get all hero banners for a specific locale (including inactive)
     * @param locale The locale
     * @return List of hero banners for the locale
     */
    @GetMapping("/locale/{locale}")
    public ResponseEntity<List<HeroBanner>> getHeroBannersByLocale(@PathVariable String locale) {
        List<HeroBanner> heroBanners = heroBannerService.getHeroBannersByLocale(locale);
        return ResponseEntity.ok(heroBanners);
    }
    
    /**
     * Get a specific hero banner by ID
     * @param id The hero banner ID
     * @return The hero banner if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<HeroBanner> getHeroBannerById(@PathVariable String id) {
        Optional<HeroBanner> heroBanner = heroBannerService.getHeroBannerById(id);
        
        if (heroBanner.isPresent()) {
            return ResponseEntity.ok(heroBanner.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get all hero banners (admin endpoint)
     * @return List of all hero banners
     */
    @GetMapping("/admin/all")
    public ResponseEntity<List<HeroBanner>> getAllHeroBanners() {
        List<HeroBanner> heroBanners = heroBannerService.getAllHeroBanners();
        return ResponseEntity.ok(heroBanners);
    }
}
