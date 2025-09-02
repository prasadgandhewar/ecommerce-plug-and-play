package com.ecommerce.api.repository;

import com.ecommerce.api.entity.CategoryFilter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryFilterRepository extends MongoRepository<CategoryFilter, String> {
    
    Optional<CategoryFilter> findByCategory(String category);
    
    boolean existsByCategory(String category);
    
    void deleteByCategory(String category);
}
