package com.ecommerce.api.service;

import com.ecommerce.api.dto.ProductRequest;
import com.ecommerce.api.dto.ProductResponse;
import com.ecommerce.api.entity.Product;
import com.ecommerce.api.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByIsActiveTrue(pageable);
        return products.map(this::convertToResponse);
    }

    public Optional<ProductResponse> getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.filter(p -> p.getIsActive()).map(this::convertToResponse);
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setIsActive(true);

        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }

    public Optional<ProductResponse> updateProduct(Long id, ProductRequest request) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setPrice(request.getPrice());
            product.setStockQuantity(request.getStockQuantity());
            product.setCategory(request.getCategory());
            product.setImageUrl(request.getImageUrl());

            Product updatedProduct = productRepository.save(product);
            return Optional.of(convertToResponse(updatedProduct));
        }
        return Optional.empty();
    }

    public boolean deleteProduct(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setIsActive(false);
            productRepository.save(product);
            return true;
        }
        return false;
    }

    public List<ProductResponse> getProductsByCategory(String category) {
        List<Product> products = productRepository.findByCategoryAndIsActiveTrue(category);
        return products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> searchProducts(String name) {
        List<Product> products = productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name);
        return products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<Product> products = productRepository.findByPriceBetweenAndIsActiveTrue(minPrice, maxPrice);
        return products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStockQuantity(product.getStockQuantity());
        response.setCategory(product.getCategory());
        response.setImageUrl(product.getImageUrl());
        response.setIsActive(product.getIsActive());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }
}
