package com.ecommerce.api.controller;

import com.ecommerce.api.entity.CartItem;
import com.ecommerce.api.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long userId) {
        List<CartItem> cartItems = cartService.getCartItems(userId);
        return ResponseEntity.ok(cartItems);
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
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Integer quantity = Integer.valueOf(request.get("quantity").toString());
            Optional<CartItem> cartItem = cartService.updateCartItem(id, quantity);
            return cartItem.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Remove item from cart
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        boolean removed = cartService.removeFromCart(id);
        return removed ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
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
