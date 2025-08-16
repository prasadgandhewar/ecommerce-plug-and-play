package com.ecommerce.api.controller;

import com.ecommerce.api.dto.CartResponse;
import com.ecommerce.api.entity.CartItem;
import com.ecommerce.api.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    // Get cart items for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<CartResponse> getCartItems(@PathVariable Long userId) {
        CartResponse cartResponse = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartResponse);
    }

    // Add item to cart
    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody Map<String, Object> request) {
        Optional<CartItem> cartItem = cartService.addToCart(request);
        return cartItem.map(item -> ResponseEntity.status(HttpStatus.CREATED).body(item))
                      .orElse(ResponseEntity.badRequest().build());
    }

    // Update cart item quantity
    @PutMapping("/{id}")
    public ResponseEntity<CartResponse> updateCartItem(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Integer quantity = Integer.valueOf(request.get("quantity").toString());
            CartResponse cartResponse = cartService.updateCartItem(userId, id, quantity);
            return ResponseEntity.ok(cartResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Remove item from cart
    @DeleteMapping("/{id}")
    public ResponseEntity<CartResponse> removeFromCart(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            CartResponse cartResponse = cartService.removeFromCart(userId, id);
            return ResponseEntity.ok(cartResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Clear all cart items for a user
    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }

    // Get cart item count for a user
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Map<String, Integer>> getCartItemCount(@PathVariable Long userId) {
        int count = cartService.getCartItemCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // Get cart total for a user
    @GetMapping("/user/{userId}/total")
    public ResponseEntity<Map<String, Object>> getCartTotal(@PathVariable Long userId) {
        Map<String, Object> cartTotal = cartService.getCartTotal(userId);
        return ResponseEntity.ok(cartTotal);
    }
}
