package com.ecommerce.api.repository;

import com.ecommerce.api.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<CartItem> findByUserId(Long userId);

    Optional<CartItem> findByUserIdAndProductId(Long userId, String productId); // Changed from Long to String

    Optional<CartItem> findByIdAndUserId(Long id, Long userId);

    int countByUserId(Long userId);

    void deleteByUserId(Long userId);
}
