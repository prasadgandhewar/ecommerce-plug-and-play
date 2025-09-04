package com.ecommerce.api.repository;

import com.ecommerce.api.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface CustomProductRepository {
    Page<Product> findByAttributeFilters(String category, Map<String, Object> attributeFilters, Pageable pageable);
}
