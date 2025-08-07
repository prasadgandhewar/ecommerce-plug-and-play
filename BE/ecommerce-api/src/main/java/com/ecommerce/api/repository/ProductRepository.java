package com.ecommerce.api.repository;

import com.ecommerce.api.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByIsActiveTrue();

    Page<Product> findByIsActiveTrue(Pageable pageable);

    List<Product> findByCategoryAndIsActiveTrue(String category);

    List<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);

    List<Product> findByPriceBetweenAndIsActiveTrue(BigDecimal minPrice, BigDecimal maxPrice);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> findActiveProductsWithFilters(
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchActiveProducts(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.isActive = true")
    List<String> findDistinctCategories();

    List<Product> findByStockQuantityLessThan(Integer threshold);
}
