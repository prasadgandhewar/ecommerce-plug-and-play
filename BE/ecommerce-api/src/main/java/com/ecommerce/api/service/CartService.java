package com.ecommerce.api.service;

import com.ecommerce.api.dto.CartItemRequest;
import com.ecommerce.api.dto.CartItemResponse;
import com.ecommerce.api.dto.CartResponse;
import com.ecommerce.api.dto.ProductResponse;
import com.ecommerce.api.entity.CartItem;
import com.ecommerce.api.entity.User;
import com.ecommerce.api.repository.CartItemRepository;
import com.ecommerce.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductService productService;

    public CartResponse getCartByUserId(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        List<CartItemResponse> cartItemResponses = cartItems.stream()
                .map(this::convertToCartItemResponse)
                .collect(Collectors.toList());

        BigDecimal totalAmount = cartItemResponses.stream()
                .filter(item -> item.getProduct() != null)
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer totalItems = cartItemResponses.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        return new CartResponse(cartItemResponses, totalItems, totalAmount);
    }

    // Legacy method for backward compatibility
    public List<CartItem> getCartItems(Long userId) {
        return cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public CartResponse addToCart(Long userId, CartItemRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if product exists in MongoDB
        Optional<ProductResponse> productOpt = productService.getProductById(request.getProductId());
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        ProductResponse product = productOpt.get();
        
        // Validate stock availability
        if (request.getVariationSku() != null) {
            // Check variation stock
            boolean variationExists = product.getVariations() != null && 
                product.getVariations().stream()
                    .anyMatch(v -> v.getSku().equals(request.getVariationSku()) && 
                                 v.getIsActive() && 
                                 v.getStockQuantity() >= request.getQuantity());
            
            if (!variationExists) {
                throw new RuntimeException("Product variation not available or insufficient stock");
            }
        } else {
            // Check main product stock
            if (product.getStockQuantity() < request.getQuantity()) {
                throw new RuntimeException("Insufficient stock for the requested quantity");
            }
        }

        // Check if item already exists in cart (including variation)
        Optional<CartItem> existingCartItem = cartItemRepository
                .findByUserIdAndProductIdAndVariationSku(userId, request.getProductId(), request.getVariationSku());

        CartItem cartItem;
        if (existingCartItem.isPresent()) {
            // Update quantity if item already exists
            cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        } else {
            // Create new cart item
            cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProductId(request.getProductId());
            cartItem.setVariationSku(request.getVariationSku());
            cartItem.setQuantity(request.getQuantity());
        }

        cartItemRepository.save(cartItem);
        return getCartByUserId(userId);
    }

    public Optional<CartItem> addToCart(Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String productId = request.get("productId").toString();
            Integer quantity = Integer.valueOf(request.get("quantity").toString());
            String variationSku = request.get("variationSku") != null ? request.get("variationSku").toString() : null;

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if product exists in MongoDB
            Optional<ProductResponse> productOpt = productService.getProductById(productId);
            if (productOpt.isEmpty()) {
                return Optional.empty();
            }

            ProductResponse product = productOpt.get();
            
            // Validate stock availability
            if (variationSku != null) {
                // Check variation stock
                boolean variationExists = product.getVariations() != null && 
                    product.getVariations().stream()
                        .anyMatch(v -> v.getSku().equals(variationSku) && 
                                     v.getIsActive() && 
                                     v.getStockQuantity() >= quantity);
                
                if (!variationExists) {
                    return Optional.empty();
                }
            } else {
                // Check main product stock
                if (product.getStockQuantity() < quantity) {
                    return Optional.empty();
                }
            }

            // Check if item already exists in cart (including variation)
            Optional<CartItem> existingCartItem = cartItemRepository.findByUserIdAndProductIdAndVariationSku(userId, productId, variationSku);

            CartItem cartItem;
            if (existingCartItem.isPresent()) {
                // Update quantity if item already exists
                cartItem = existingCartItem.get();
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
            } else {
                // Create new cart item
                cartItem = new CartItem();
                cartItem.setUser(user);
                cartItem.setProductId(productId);
                cartItem.setVariationSku(variationSku);
                cartItem.setQuantity(quantity);
            }

            CartItem savedCartItem = cartItemRepository.save(cartItem);
            return Optional.of(savedCartItem);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public CartResponse updateCartItem(Long userId, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findByIdAndUserId(cartItemId, userId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        return getCartByUserId(userId);
    }

    public CartResponse removeFromCart(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Verify the cart item belongs to the user
        if (!cartItem.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        cartItemRepository.delete(cartItem);
        return getCartByUserId(userId);
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

    public Integer getCartItemCount(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        return cartItems.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    public Map<String, Object> getCartTotal(Long userId) {
        CartResponse cartResponse = getCartByUserId(userId);
        
        return Map.of(
            "totalAmount", cartResponse.getTotalAmount().doubleValue(),
            "totalItems", cartResponse.getTotalItems(),
            "itemCount", cartResponse.getItems().size()
        );
    }

    public boolean validateCartStock(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        
        for (CartItem cartItem : cartItems) {
            Optional<ProductResponse> productOpt = productService.getProductById(cartItem.getProductId());
            if (productOpt.isEmpty()) {
                return false; // Product not found
            }
            
            ProductResponse product = productOpt.get();
            
            if (cartItem.getVariationSku() != null) {
                // Check variation stock
                boolean hasStock = product.getVariations() != null && 
                    product.getVariations().stream()
                        .anyMatch(v -> v.getSku().equals(cartItem.getVariationSku()) && 
                                     v.getIsActive() && 
                                     v.getStockQuantity() >= cartItem.getQuantity());
                if (!hasStock) {
                    return false;
                }
            } else {
                // Check main product stock
                if (product.getStockQuantity() < cartItem.getQuantity()) {
                    return false;
                }
            }
        }
        
        return true;
    }

    public List<CartItemResponse> getOutOfStockItems(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        
        return cartItems.stream()
                .filter(cartItem -> {
                    Optional<ProductResponse> productOpt = productService.getProductById(cartItem.getProductId());
                    if (productOpt.isEmpty()) {
                        return true; // Consider missing products as out of stock
                    }
                    
                    ProductResponse product = productOpt.get();
                    
                    if (cartItem.getVariationSku() != null) {
                        // Check variation stock
                        return product.getVariations() == null || 
                            product.getVariations().stream()
                                .noneMatch(v -> v.getSku().equals(cartItem.getVariationSku()) && 
                                             v.getIsActive() && 
                                             v.getStockQuantity() >= cartItem.getQuantity());
                    } else {
                        // Check main product stock
                        return product.getStockQuantity() < cartItem.getQuantity();
                    }
                })
                .map(this::convertToCartItemResponse)
                .collect(Collectors.toList());
    }

    public CartResponse removeOutOfStockItems(Long userId) {
        List<CartItem> outOfStockItems = cartItemRepository.findByUserId(userId).stream()
                .filter(cartItem -> {
                    Optional<ProductResponse> productOpt = productService.getProductById(cartItem.getProductId());
                    if (productOpt.isEmpty()) {
                        return true;
                    }
                    
                    ProductResponse product = productOpt.get();
                    
                    if (cartItem.getVariationSku() != null) {
                        return product.getVariations() == null || 
                            product.getVariations().stream()
                                .noneMatch(v -> v.getSku().equals(cartItem.getVariationSku()) && 
                                             v.getIsActive() && 
                                             v.getStockQuantity() >= cartItem.getQuantity());
                    } else {
                        return product.getStockQuantity() < cartItem.getQuantity();
                    }
                })
                .collect(Collectors.toList());
        
        cartItemRepository.deleteAll(outOfStockItems);
        return getCartByUserId(userId);
    }

    private CartItemResponse convertToCartItemResponse(CartItem cartItem) {
        CartItemResponse response = new CartItemResponse();
        response.setId(cartItem.getId());
        response.setProductId(cartItem.getProductId());
        response.setVariationSku(cartItem.getVariationSku());
        response.setQuantity(cartItem.getQuantity());
        response.setCreatedAt(cartItem.getCreatedAt());

        // Fetch product details from MongoDB
        Optional<ProductResponse> productOpt = productService.getProductById(cartItem.getProductId());
        if (productOpt.isPresent()) {
            ProductResponse product = productOpt.get();
            response.setProduct(product);
            
            // If there's a variation SKU, find and set the selected variation
            if (cartItem.getVariationSku() != null && product.getVariations() != null) {
                product.getVariations().stream()
                    .filter(variation -> variation.getSku().equals(cartItem.getVariationSku()))
                    .findFirst()
                    .ifPresent(response::setSelectedVariation);
            }
        }

        return response;
    }
}
