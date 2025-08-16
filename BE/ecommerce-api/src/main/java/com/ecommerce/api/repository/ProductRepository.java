package com.ecommerce.api.repository;

import com.ecommerce.api.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findByIsActiveTrue();

    Page<Product> findByIsActiveTrue(Pageable pageable);

    List<Product> findByCategoryAndIsActiveTrue(String category);

    List<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);

    List<Product> findByPriceBetweenAndIsActiveTrue(BigDecimal minPrice, BigDecimal maxPrice);

    @Query("{ 'isActive': true, " +
           "$and: [ " +
           "{ $or: [ { 'category': { $exists: false } }, { 'category': null }, { 'category': ?0 } ] }, " +
           "{ $or: [ { 'price': { $gte: ?1 } } ] }, " +
           "{ $or: [ { 'price': { $lte: ?2 } } ] } " +
           "] }")
    List<Product> findByFilters(String category, BigDecimal minPrice, BigDecimal maxPrice);

    @Query(value = "{ 'isActive': true, 'category': { $ne: null } }", fields = "{ 'category': 1 }")
    List<Product> findDistinctCategoryProducts();
}
