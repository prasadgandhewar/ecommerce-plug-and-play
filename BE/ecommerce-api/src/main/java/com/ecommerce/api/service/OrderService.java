package com.ecommerce.api.service;

import com.ecommerce.api.entity.Order;
import com.ecommerce.api.entity.OrderItem;
import com.ecommerce.api.entity.Product;
import com.ecommerce.api.entity.User;
import com.ecommerce.api.repository.OrderRepository;
import com.ecommerce.api.repository.ProductRepository;
import com.ecommerce.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Optional<Order> createOrder(Map<String, Object> orderRequest) {
        try {
            Long userId = Long.valueOf(orderRequest.get("userId").toString());
            String shippingAddress = (String) orderRequest.get("shippingAddress");
            String billingAddress = (String) orderRequest.get("billingAddress");
            String paymentMethod = (String) orderRequest.get("paymentMethod");
            String notes = (String) orderRequest.get("notes");

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) orderRequest.get("items");

            Optional<User> user = userRepository.findById(userId);
            if (!user.isPresent()) {
                return Optional.empty();
            }

            Order order = new Order();
            order.setUser(user.get());
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
                Long productId = Long.valueOf(itemData.get("productId").toString());
                Integer quantity = Integer.valueOf(itemData.get("quantity").toString());

                Optional<Product> product = productRepository.findById(productId);
                if (product.isPresent()) {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(savedOrder);
                    orderItem.setProduct(product.get());
                    orderItem.setQuantity(quantity);
                    orderItem.setUnitPrice(product.get().getPrice());

                    BigDecimal subtotal = product.get().getPrice().multiply(BigDecimal.valueOf(quantity));
                    orderItem.setSubtotal(subtotal);
                    totalAmount = totalAmount.add(subtotal);

                    savedOrder.getOrderItems().add(orderItem);
                }
            }

            savedOrder.setTotalAmount(totalAmount);
            Order finalOrder = orderRepository.save(savedOrder);

            return Optional.of(finalOrder);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<Order> updateOrderStatus(Long id, String status) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            try {
                Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
                order.setStatus(orderStatus);
                Order updatedOrder = orderRepository.save(order);
                return Optional.of(updatedOrder);
            } catch (IllegalArgumentException e) {
                return Optional.empty();
            }
        }
        return Optional.empty();
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<List<Order>> getOrdersByStatus(String status) {
        try {
            Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            List<Order> orders = orderRepository.findByStatusOrderByCreatedAtDesc(orderStatus);
            return Optional.of(orders);
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public Optional<Order> cancelOrder(Long id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            if (order.getStatus() == Order.OrderStatus.PENDING || order.getStatus() == Order.OrderStatus.CONFIRMED) {
                order.setStatus(Order.OrderStatus.CANCELLED);
                Order updatedOrder = orderRepository.save(order);
                return Optional.of(updatedOrder);
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
