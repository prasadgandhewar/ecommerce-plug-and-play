package com.ecommerce.api.controller;

import com.ecommerce.api.dto.ProductRequest;
import com.ecommerce.api.dto.ProductResponse;
import com.ecommerce.api.dto.ProductReviewRequest;
import com.ecommerce.api.dto.ProductReviewResponse;
import com.ecommerce.api.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ProductController {

    @Autowired
    private ProductService productService;

    // Get all products with pagination
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductResponse> products = productService.getAllProducts(pageable, category, subCategory, brand, minPrice, maxPrice);

        return ResponseEntity.ok(products);
    }

    // Get products with attribute-based filtering
    @GetMapping("/filter")
    public ResponseEntity<Page<ProductResponse>> getProductsWithFilters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String category,
            @RequestParam Map<String, String> allParams) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Extract attribute filters from request parameters
        Map<String, Object> attributeFilters = extractAttributeFilters(allParams);
        
        Page<ProductResponse> products = productService.getProductsWithAttributeFilters(pageable, category, attributeFilters);

        return ResponseEntity.ok(products);
    }

    // Helper method to extract attribute filters from request parameters
    private Map<String, Object> extractAttributeFilters(Map<String, String> allParams) {
        Map<String, Object> attributeFilters = new java.util.HashMap<>();
        
        // Skip standard pagination and sorting parameters
        String[] skipParams = {"page", "size", "sortBy", "sortDir", "category"};
        
        for (Map.Entry<String, String> entry : allParams.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            
            // Skip empty values and standard parameters
            if (value == null || value.trim().isEmpty()) {
                continue;
            }
            
            boolean shouldSkip = false;
            for (String skipParam : skipParams) {
                if (key.equals(skipParam)) {
                    shouldSkip = true;
                    break;
                }
            }
            
            if (!shouldSkip) {
                // Handle comma-separated values for multi-select filters
                if (value.contains(",")) {
                    attributeFilters.put(key, java.util.Arrays.asList(value.split(",")));
                } else {
                    attributeFilters.put(key, value);
                }
            }
        }
        
        return attributeFilters;
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable String id) {
        Optional<ProductResponse> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get product by SKU
    @GetMapping("/sku/{sku}")
    public ResponseEntity<ProductResponse> getProductBySku(@PathVariable String sku) {
        Optional<ProductResponse> product = productService.getProductBySku(sku);
        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Create new product
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    // Update product
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable String id, @Valid @RequestBody ProductRequest request) {
        Optional<ProductResponse> product = productService.updateProduct(id, request);
        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Delete product (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        boolean deleted = productService.deleteProduct(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    // Get products by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable String category) {
        List<ProductResponse> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    // Get products by subcategory
    @GetMapping("/category/{category}/subcategory/{subCategory}")
    public ResponseEntity<List<ProductResponse>> getProductsBySubCategory(
            @PathVariable String category, 
            @PathVariable String subCategory) {
        List<ProductResponse> products = productService.getProductsBySubCategory(category, subCategory);
        return ResponseEntity.ok(products);
    }

    // Get products by brand
    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<ProductResponse>> getProductsByBrand(@PathVariable String brand) {
        List<ProductResponse> products = productService.getProductsByBrand(brand);
        return ResponseEntity.ok(products);
    }

    // Search products by name
    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductResponse> products = productService.searchProducts(query, pageable);
        return ResponseEntity.ok(products);
    }

    // Get products by price range
    @GetMapping("/price-range")
    public ResponseEntity<List<ProductResponse>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        List<ProductResponse> products = productService.getProductsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }

    // Get all categories
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = productService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // Get subcategories by category
    @GetMapping("/categories/{category}/subcategories")
    public ResponseEntity<List<String>> getSubCategoriesByCategory(@PathVariable String category) {
        List<String> subCategories = productService.getSubCategoriesByCategory(category);
        return ResponseEntity.ok(subCategories);
    }

    // Get all brands
    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands() {
        List<String> brands = productService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    // Add review to product
    @PostMapping("/{id}/reviews")
    public ResponseEntity<ProductReviewResponse> addProductReview(@PathVariable String id, @Valid @RequestBody ProductReviewRequest request) {
        Optional<ProductReviewResponse> review = productService.addProductReview(id, request);
        return review.map(r -> ResponseEntity.status(HttpStatus.CREATED).body(r))
                    .orElse(ResponseEntity.badRequest().build());
    }

    // Get product reviews
    @GetMapping("/{id}/reviews")
    public ResponseEntity<Page<ProductReviewResponse>> getProductReviews(
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductReviewResponse> reviews = productService.getProductReviews(id, pageable);
        return ResponseEntity.ok(reviews);
    }

    // Get product rating summary
    @GetMapping("/{id}/rating-summary")
    public ResponseEntity<Map<String, Object>> getProductRatingSummary(@PathVariable String id) {
        Map<String, Object> ratingSummary = productService.getProductRatingSummary(id);
        return ResponseEntity.ok(ratingSummary);
    }

    // Update product stock
    @PutMapping("/{id}/stock")
    public ResponseEntity<ProductResponse> updateProductStock(
            @PathVariable String id, 
            @RequestBody Map<String, Integer> stockUpdate) {
        Integer newStock = stockUpdate.get("stockQuantity");
        Optional<ProductResponse> product = productService.updateProductStock(id, newStock);
        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Update variation stock
    @PutMapping("/{id}/variations/{variationSku}/stock")
    public ResponseEntity<ProductResponse> updateVariationStock(
            @PathVariable String id,
            @PathVariable String variationSku,
            @RequestBody Map<String, Integer> stockUpdate) {
        Integer newStock = stockUpdate.get("stockQuantity");
        Optional<ProductResponse> product = productService.updateVariationStock(id, variationSku, newStock);
        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get featured products
    @GetMapping("/featured")
    public ResponseEntity<List<ProductResponse>> getFeaturedProducts(
            @RequestParam(defaultValue = "10") int limit) {
        List<ProductResponse> products = productService.getFeaturedProducts(limit);
        return ResponseEntity.ok(products);
    }

    // Get products with low stock
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductResponse>> getLowStockProducts(
            @RequestParam(defaultValue = "10") int threshold) {
        List<ProductResponse> products = productService.getLowStockProducts(threshold);
        return ResponseEntity.ok(products);
    }

    // Get top-rated products
    @GetMapping("/top-rated")
    public ResponseEntity<List<ProductResponse>> getTopRatedProducts(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "4.0") Double minRating) {
        List<ProductResponse> products = productService.getTopRatedProducts(limit, minRating);
        return ResponseEntity.ok(products);
    }

    // Debug endpoint: Get all products including inactive ones
    @GetMapping("/debug/all")
    public ResponseEntity<Page<ProductResponse>> getAllProductsIncludingInactive(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getAllProductsIncludingInactive(pageable);
        return ResponseEntity.ok(products);
    }

    // Debug endpoint: Fix missing isActive fields
    @PostMapping("/debug/fix-active-field")
    public ResponseEntity<Map<String, Object>> fixMissingIsActiveField() {
        long updatedCount = productService.fixMissingIsActiveField();
        return ResponseEntity.ok(Map.of(
            "message", "Updated products with missing isActive field",
            "updatedCount", updatedCount
        ));
    }
}
