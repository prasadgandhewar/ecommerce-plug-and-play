package com.ecommerce.api.service;

import com.ecommerce.api.dto.OrderItemResponse;
import com.ecommerce.api.dto.OrderResponse;
import com.ecommerce.api.dto.ProductResponse;
import com.ecommerce.api.entity.Order;
import com.ecommerce.api.entity.OrderItem;
import com.ecommerce.api.entity.User;
import com.ecommerce.api.repository.OrderRepository;
import com.ecommerce.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductService productService;

    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(this::convertToOrderResponse);
    }

    public Optional<OrderResponse> getOrderById(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(this::convertToOrderResponse);
    }

    public Optional<OrderResponse> createOrder(Map<String, Object> orderRequest) {
        try {
            Long userId = Long.valueOf(orderRequest.get("userId").toString());
            String shippingAddress = (String) orderRequest.get("shippingAddress");
            String billingAddress = (String) orderRequest.get("billingAddress");
            String paymentMethod = (String) orderRequest.get("paymentMethod");
            String notes = (String) orderRequest.get("notes");

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) orderRequest.get("items");

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Order order = new Order();
            order.setUser(user);
            order.setStatus(Order.OrderStatus.PENDING);
            order.setShippingAddress(shippingAddress);
            order.setBillingAddress(billingAddress);
            order.setPaymentMethod(paymentMethod);
            order.setNotes(notes);

            BigDecimal totalAmount = BigDecimal.ZERO;

            // Save order first to get ID
            Order savedOrder = orderRepository.save(order);

            // Add order items
            for (Map<String, Object> itemData : items) {
                String productId = itemData.get("productId").toString();
                Integer quantity = Integer.valueOf(itemData.get("quantity").toString());

                // Fetch product from MongoDB
                Optional<ProductResponse> productOpt = productService.getProductById(productId);
                if (productOpt.isPresent()) {
                    ProductResponse product = productOpt.get();
                    
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(savedOrder);
                    orderItem.setProductId(productId);
                    orderItem.setProductName(product.getName());
                    orderItem.setProductImageUrl(product.getImageUrl());
                    orderItem.setQuantity(quantity);
                    orderItem.setUnitPrice(product.getPrice());

                    BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
                    orderItem.setSubtotal(subtotal);
                    totalAmount = totalAmount.add(subtotal);

                    savedOrder.getOrderItems().add(orderItem);
                }
            }

            savedOrder.setTotalAmount(totalAmount);
            Order finalOrder = orderRepository.save(savedOrder);

            return Optional.of(convertToOrderResponse(finalOrder));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private OrderResponse convertToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUser().getId());
        response.setStatus(order.getStatus());
        response.setTotalAmount(order.getTotalAmount());
        response.setShippingAddress(order.getShippingAddress());
        response.setBillingAddress(order.getBillingAddress());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setNotes(order.getNotes());
        response.setCreatedAt(order.getCreatedAt());

        List<OrderItemResponse> orderItemResponses = order.getOrderItems().stream()
                .map(this::convertToOrderItemResponse)
                .collect(Collectors.toList());
        response.setOrderItems(orderItemResponses);

        return response;
    }

    private OrderItemResponse convertToOrderItemResponse(OrderItem orderItem) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(orderItem.getId());
        response.setProductId(orderItem.getProductId());
        response.setProductName(orderItem.getProductName());
        response.setProductImageUrl(orderItem.getProductImageUrl());
        response.setQuantity(orderItem.getQuantity());
        response.setUnitPrice(orderItem.getUnitPrice());
        response.setSubtotal(orderItem.getSubtotal());
        return response;
    }

    public Optional<OrderResponse> updateOrderStatus(Long id, String status) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            try {
                Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
                order.setStatus(orderStatus);
                Order updatedOrder = orderRepository.save(order);
                return Optional.of(convertToOrderResponse(updatedOrder));
            } catch (IllegalArgumentException e) {
                return Optional.empty();
            }
        }
        return Optional.empty();
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    public Optional<List<OrderResponse>> getOrdersByStatus(String status) {
        try {
            Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            List<Order> orders = orderRepository.findByStatusOrderByCreatedAtDesc(orderStatus);
            List<OrderResponse> orderResponses = orders.stream()
                    .map(this::convertToOrderResponse)
                    .collect(Collectors.toList());
            return Optional.of(orderResponses);
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public Optional<OrderResponse> cancelOrder(Long id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            if (order.getStatus() == Order.OrderStatus.PENDING || order.getStatus() == Order.OrderStatus.CONFIRMED) {
                order.setStatus(Order.OrderStatus.CANCELLED);
                Order updatedOrder = orderRepository.save(order);
                return Optional.of(convertToOrderResponse(updatedOrder));
            }
        }
        return Optional.empty();
    }

    public boolean deleteOrder(Long id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            orderRepository.delete(optionalOrder.get());
            return true;
        }
        return false;
    }
}
