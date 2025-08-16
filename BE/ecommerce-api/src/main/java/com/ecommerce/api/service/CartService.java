package com.ecommerce.api.service;

import com.ecommerce.api.entity.CartItem;
import com.ecommerce.api.entity.Product;
import com.ecommerce.api.entity.User;
import com.ecommerce.api.repository.CartItemRepository;
import com.ecommerce.api.repository.ProductRepository;
import com.ecommerce.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CartItem> getCartItems(Long userId) {
        return cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<CartItem> addToCart(Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long productId = Long.valueOf(request.get("productId").toString());
            Integer quantity = Integer.valueOf(request.get("quantity").toString());

            Optional<User> user = userRepository.findById(userId);
            Optional<Product> product = productRepository.findById(productId);

            if (!user.isPresent() || !product.isPresent()) {
                return Optional.empty();
            }

            // Check if item already exists in cart
            Optional<CartItem> existingCartItem = cartItemRepository.findByUserIdAndProductId(userId, productId);

            CartItem cartItem;
            if (existingCartItem.isPresent()) {
                // Update quantity if item already exists
                cartItem = existingCartItem.get();
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
            } else {
                // Create new cart item
                cartItem = new CartItem();
                cartItem.setUser(user.get());
                cartItem.setProduct(product.get());
                cartItem.setQuantity(quantity);
            }

            CartItem savedCartItem = cartItemRepository.save(cartItem);
            return Optional.of(savedCartItem);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<CartItem> updateCartItem(Long id, Integer quantity) {
        try {
            Optional<CartItem> optionalCartItem = cartItemRepository.findById(id);
            if (optionalCartItem.isPresent()) {
                CartItem cartItem = optionalCartItem.get();
                cartItem.setQuantity(quantity);
                CartItem updatedCartItem = cartItemRepository.save(cartItem);
                return Optional.of(updatedCartItem);
            }
        } catch (Exception e) {
            return Optional.empty();
        }
        return Optional.empty();
    }

    public boolean removeFromCart(Long id) {
        Optional<CartItem> optionalCartItem = cartItemRepository.findById(id);
        if (optionalCartItem.isPresent()) {
            cartItemRepository.delete(optionalCartItem.get());
            return true;
        }
        return false;
    }

    public void clearCart(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        cartItemRepository.deleteAll(cartItems);
    }

    public int getCartItemCount(Long userId) {
        return cartItemRepository.countByUserId(userId);
    }

    public Map<String, Object> getCartTotal(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

        double totalAmount = 0.0;
        int totalItems = 0;

        for (CartItem item : cartItems) {
            double itemTotal = item.getProduct().getPrice().doubleValue() * item.getQuantity();
            totalAmount += itemTotal;
            totalItems += item.getQuantity();
        }

        return Map.of(
            "totalAmount", totalAmount,
            "totalItems", totalItems,
            "itemCount", cartItems.size()
        );
    }
}
