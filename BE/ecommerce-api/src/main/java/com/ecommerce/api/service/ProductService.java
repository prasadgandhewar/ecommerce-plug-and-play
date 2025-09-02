package com.ecommerce.api.service;

import com.ecommerce.api.dto.CategoryFilterDto;
import com.ecommerce.api.dto.ProductRequest;
import com.ecommerce.api.dto.ProductResponse;
import com.ecommerce.api.dto.ProductReviewRequest;
import com.ecommerce.api.dto.ProductReviewResponse;
import com.ecommerce.api.entity.Product;
import com.ecommerce.api.entity.ProductReview;
import com.ecommerce.api.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private CategoryFilterService categoryFilterService;

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        // Use the more flexible query that includes products with null isActive
        Page<Product> products = productRepository.findActiveOrNullProducts(pageable);
        return products.map(this::convertToResponse);
    }

    // Debug method to get all products regardless of isActive status
    public Page<ProductResponse> getAllProductsIncludingInactive(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(this::convertToResponse);
    }

    public Page<ProductResponse> getAllProducts(Pageable pageable, String category, String subCategory, 
                                              String brand, BigDecimal minPrice, BigDecimal maxPrice) {
        if (category == null && subCategory == null && brand == null && minPrice == null && maxPrice == null) {
            return getAllProducts(pageable);
        }

        // Set default values for null parameters
        if (minPrice == null) minPrice = BigDecimal.ZERO;
        if (maxPrice == null) maxPrice = new BigDecimal("999999.99");

        Page<Product> products = productRepository.findByFilters(category, subCategory, brand, minPrice, maxPrice, pageable);
        return products.map(this::convertToResponse);
    }

    public Optional<ProductResponse> getProductById(String id) {
        Optional<Product> product = productRepository.findById(id);
        return product.filter(p -> p.getIsActive()).map(this::convertToResponse);
    }

    public Optional<ProductResponse> getProductBySku(String sku) {
        Optional<Product> product = productRepository.findBySkuAndIsActiveTrue(sku);
        return product.map(this::convertToResponse);
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        mapRequestToProduct(request, product);
        product.setIsActive(true);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }

    public Optional<ProductResponse> updateProduct(String id, ProductRequest request) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            mapRequestToProduct(request, product);
            product.setUpdatedAt(LocalDateTime.now());

            Product updatedProduct = productRepository.save(product);
            return Optional.of(convertToResponse(updatedProduct));
        }
        return Optional.empty();
    }

    public boolean deleteProduct(String id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setIsActive(false); // Soft delete
            product.setUpdatedAt(LocalDateTime.now());
            productRepository.save(product);
            return true;
        }
        return false;
    }

    public List<ProductResponse> getProductsByCategory(String category) {
        List<Product> products = productRepository.findByCategoryAndIsActiveTrue(category);
        return products.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsBySubCategory(String category, String subCategory) {
        List<Product> products = productRepository.findByCategoryAndSubCategoryAndIsActiveTrue(category, subCategory);
        return products.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByBrand(String brand) {
        List<Product> products = productRepository.findByBrandAndIsActiveTrue(brand);
        return products.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public Page<ProductResponse> searchProducts(String query, Pageable pageable) {
        Page<Product> products = productRepository.findBySearchQuery(query, pageable);
        return products.map(this::convertToResponse);
    }

    public List<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<Product> products = productRepository.findByPriceBetweenAndIsActiveTrue(minPrice, maxPrice);
        return products.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        // First try to get categories from the new category filter system
        try {
            List<String> categoriesFromFilter = categoryFilterService.getAllCategoryNames();
            if (!categoriesFromFilter.isEmpty()) {
                return categoriesFromFilter;
            }
        } catch (Exception e) {
            System.err.println("Error getting categories from filter service: " + e.getMessage());
        }
        
        // Fallback to getting categories from products
        List<Product> products = productRepository.findDistinctCategoryProducts();
        return products.stream()
                .map(Product::getCategory)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    // Method to get categories from products (legacy)
    public List<String> getCategoriesFromProducts() {
        List<Product> products = productRepository.findDistinctCategoryProducts();
        return products.stream()
                .map(Product::getCategory)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    // Method to get available filters for a category
    public CategoryFilterDto getFiltersForCategory(String category) {
        try {
            Optional<CategoryFilterDto> categoryFilter = categoryFilterService.getCategoryByName(category);
            return categoryFilter.orElse(createEmptyFilter(category));
        } catch (Exception e) {
            System.err.println("Error getting filters for category " + category + ": " + e.getMessage());
            return createEmptyFilter(category);
        }
    }

    private CategoryFilterDto createEmptyFilter(String category) {
        CategoryFilterDto emptyFilter = new CategoryFilterDto();
        emptyFilter.setCategory(category);
        emptyFilter.setFilters(new ArrayList<>());
        return emptyFilter;
    }

    public List<String> getSubCategoriesByCategory(String category) {
        List<Product> products = productRepository.findDistinctSubCategoryProductsByCategory(category);
        return products.stream()
                .map(Product::getSubCategory)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> getAllBrands() {
        List<Product> products = productRepository.findDistinctBrandProducts();
        return products.stream()
                .map(Product::getBrand)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public Optional<ProductReviewResponse> addProductReview(String productId, ProductReviewRequest request) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            
            ProductReview review = new ProductReview();
            review.setUserId(request.getUserId());
            review.setRating(request.getRating());
            review.setComment(request.getComment());
            review.setDate(LocalDateTime.now());
            review.setIsVerifiedPurchase(request.getIsVerifiedPurchase());
            review.setIsApproved(true); // Auto-approve for now
            
            product.addReview(review);
            product.setUpdatedAt(LocalDateTime.now());
            
            productRepository.save(product);
            
            ProductReviewResponse response = new ProductReviewResponse();
            response.setUserId(review.getUserId());
            response.setRating(review.getRating());
            response.setComment(review.getComment());
            response.setDate(review.getDate());
            response.setIsVerifiedPurchase(review.getIsVerifiedPurchase());
            response.setIsApproved(review.getIsApproved());
            
            return Optional.of(response);
        }
        return Optional.empty();
    }

    public Page<ProductReviewResponse> getProductReviews(String productId, Pageable pageable) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            List<ProductReview> reviews = product.getReviews();
            
            if (reviews == null || reviews.isEmpty()) {
                return new PageImpl<>(Collections.emptyList(), pageable, 0);
            }
            
            // Filter approved reviews and sort by date (newest first)
            List<ProductReviewResponse> reviewResponses = reviews.stream()
                    .filter(review -> review.getIsApproved() != null && review.getIsApproved())
                    .sorted((r1, r2) -> r2.getDate().compareTo(r1.getDate()))
                    .map(review -> {
                        ProductReviewResponse response = new ProductReviewResponse();
                        response.setUserId(review.getUserId());
                        response.setRating(review.getRating());
                        response.setComment(review.getComment());
                        response.setDate(review.getDate());
                        response.setIsVerifiedPurchase(review.getIsVerifiedPurchase());
                        response.setIsApproved(review.getIsApproved());
                        return response;
                    })
                    .collect(Collectors.toList());
            
            // Manual pagination
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), reviewResponses.size());
            List<ProductReviewResponse> pageContent = reviewResponses.subList(start, end);
            
            return new PageImpl<>(pageContent, pageable, reviewResponses.size());
        }
        return new PageImpl<>(Collections.emptyList(), pageable, 0);
    }

    public Map<String, Object> getProductRatingSummary(String productId) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        Map<String, Object> summary = new HashMap<>();
        
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            List<ProductReview> reviews = product.getReviews();
            
            if (reviews == null || reviews.isEmpty()) {
                summary.put("averageRating", 0.0);
                summary.put("totalReviews", 0);
                summary.put("ratingDistribution", Map.of(1, 0, 2, 0, 3, 0, 4, 0, 5, 0));
                return summary;
            }
            
            List<ProductReview> approvedReviews = reviews.stream()
                    .filter(review -> review.getIsApproved() != null && review.getIsApproved())
                    .collect(Collectors.toList());
            
            summary.put("averageRating", product.getAverageRating());
            summary.put("totalReviews", approvedReviews.size());
            
            // Rating distribution
            Map<Integer, Long> distribution = approvedReviews.stream()
                    .collect(Collectors.groupingBy(ProductReview::getRating, Collectors.counting()));
            
            Map<Integer, Integer> ratingDistribution = new HashMap<>();
            for (int i = 1; i <= 5; i++) {
                ratingDistribution.put(i, distribution.getOrDefault(i, 0L).intValue());
            }
            summary.put("ratingDistribution", ratingDistribution);
        } else {
            summary.put("averageRating", 0.0);
            summary.put("totalReviews", 0);
            summary.put("ratingDistribution", Map.of(1, 0, 2, 0, 3, 0, 4, 0, 5, 0));
        }
        
        return summary;
    }

    public Optional<ProductResponse> updateProductStock(String productId, Integer newStock) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setStockQuantity(newStock);
            product.setUpdatedAt(LocalDateTime.now());
            
            Product updatedProduct = productRepository.save(product);
            return Optional.of(convertToResponse(updatedProduct));
        }
        return Optional.empty();
    }

    public Optional<ProductResponse> updateVariationStock(String productId, String variationSku, Integer newStock) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            
            if (product.getVariations() != null) {
                product.getVariations().stream()
                        .filter(variation -> variation.getSku().equals(variationSku))
                        .findFirst()
                        .ifPresent(variation -> variation.setStockQuantity(newStock));
                
                product.setUpdatedAt(LocalDateTime.now());
                Product updatedProduct = productRepository.save(product);
                return Optional.of(convertToResponse(updatedProduct));
            }
        }
        return Optional.empty();
    }

    public List<ProductResponse> getFeaturedProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findFeaturedProducts(pageable);
        return products.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getLowStockProducts(int threshold) {
        List<Product> products = productRepository.findLowStockProducts(threshold);
        return products.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getTopRatedProducts(int limit, Double minRating) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findTopRatedProducts(minRating, pageable);
        return products.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    // Utility method to fix existing products that don't have isActive field
    public long fixMissingIsActiveField() {
        List<Product> allProducts = productRepository.findAll();
        long updatedCount = 0;
        
        for (Product product : allProducts) {
            if (product.getIsActive() == null) {
                product.setIsActive(true);
                product.setUpdatedAt(LocalDateTime.now());
                productRepository.save(product);
                updatedCount++;
            }
        }
        
        return updatedCount;
    }

    // Alternative method using the new repository query
    public Page<ProductResponse> getAllActiveProducts(Pageable pageable) {
        Page<Product> products = productRepository.findActiveOrNullProducts(pageable);
        return products.map(this::convertToResponse);
    }

    private void mapRequestToProduct(ProductRequest request, Product product) {
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setSubCategory(request.getSubCategory());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        product.setCurrency(request.getCurrency());
        product.setStockQuantity(request.getStockQuantity());
        product.setImages(request.getImages());
        product.setSpecifications(request.getSpecifications());
        product.setVariations(request.getVariations());
        product.setIsActive(request.getIsActive());
    }

    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = modelMapper.map(product, ProductResponse.class);
        
        // Compute additional fields
        response.setAverageRating(product.getAverageRating());
        response.setTotalReviews(product.getTotalReviews());
        response.setTotalStock(product.getTotalStock());
        response.setMainImageUrl(product.getMainImageUrl());
        
        return response;
    }
}
