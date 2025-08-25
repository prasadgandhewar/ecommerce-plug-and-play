package com.ecommerce.api.repository;

import com.ecommerce.api.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    // Basic queries
    List<Product> findByIsActiveTrue();
    Page<Product> findByIsActiveTrue(Pageable pageable);
    
    // Query to get products where isActive is true OR null (for backward compatibility)
    @Query("{ $or: [ { 'isActive': true }, { 'isActive': { $exists: false } }, { 'isActive': null } ] }")
    Page<Product> findActiveOrNullProducts(Pageable pageable);
    
    @Query("{ $or: [ { 'isActive': true }, { 'isActive': { $exists: false } }, { 'isActive': null } ] }")
    List<Product> findActiveOrNullProductsList();
    
    Optional<Product> findBySkuAndIsActiveTrue(String sku);

    // Category queries
    List<Product> findByCategoryAndIsActiveTrue(String category);
    List<Product> findBySubCategoryAndIsActiveTrue(String subCategory);
    List<Product> findByCategoryAndSubCategoryAndIsActiveTrue(String category, String subCategory);

    // Brand queries
    List<Product> findByBrandAndIsActiveTrue(String brand);

    // Search queries
    @Query("{ 'isActive': true, $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } }, " +
           "{ 'brand': { $regex: ?0, $options: 'i' } }, " +
           "{ 'category': { $regex: ?0, $options: 'i' } }, " +
           "{ 'subCategory': { $regex: ?0, $options: 'i' } } " +
           "] }")
    Page<Product> findBySearchQuery(String query, Pageable pageable);

    // Price range queries
    List<Product> findByPriceBetweenAndIsActiveTrue(BigDecimal minPrice, BigDecimal maxPrice);

    // Advanced filtering
    @Query("{ 'isActive': true, " +
           "$and: [ " +
           "{ $or: [ { 'category': { $exists: false } }, { 'category': null }, { 'category': ?0 } ] }, " +
           "{ $or: [ { 'subCategory': { $exists: false } }, { 'subCategory': null }, { 'subCategory': ?1 } ] }, " +
           "{ $or: [ { 'brand': { $exists: false } }, { 'brand': null }, { 'brand': ?2 } ] }, " +
           "{ $or: [ { 'price': { $gte: ?3 } } ] }, " +
           "{ $or: [ { 'price': { $lte: ?4 } } ] } " +
           "] }")
    Page<Product> findByFilters(String category, String subCategory, String brand, 
                               BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    // Stock queries
    @Query("{ 'isActive': true, 'stockQuantity': { $lte: ?0 } }")
    List<Product> findLowStockProducts(Integer threshold);

    // Rating queries
    @Query("{ 'isActive': true, 'averageRating': { $gte: ?0 } }")
    List<Product> findTopRatedProducts(Double minRating, Pageable pageable);

    // Featured products (can be based on various criteria - here using high rating and recent)
    @Query("{ 'isActive': true, 'averageRating': { $gte: 4.0 } }")
    List<Product> findFeaturedProducts(Pageable pageable);

    // Distinct value queries for filters
    @Query(value = "{ 'isActive': true, 'category': { $ne: null, $ne: '' } }", fields = "{ 'category': 1 }")
    List<Product> findDistinctCategoryProducts();

    @Query(value = "{ 'isActive': true, 'category': ?0, 'subCategory': { $ne: null, $ne: '' } }", 
           fields = "{ 'subCategory': 1 }")
    List<Product> findDistinctSubCategoryProductsByCategory(String category);

    @Query(value = "{ 'isActive': true, 'brand': { $ne: null, $ne: '' } }", fields = "{ 'brand': 1 }")
    List<Product> findDistinctBrandProducts();

    // Inventory management
    @Query("{ 'variations.sku': ?0 }")
    Optional<Product> findByVariationSku(String variationSku);
}
