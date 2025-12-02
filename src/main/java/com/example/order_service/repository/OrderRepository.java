package com.example.order_service.repository;

import com.example.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find all orders by a specific user
    List<Order> findByUserId(Long userId);

    // Find orders by status
    List<Order> findByStatus(String status);

    // Find orders by user and status
    List<Order> findByUserIdAndStatus(Long userId, String status);

    // Find orders by payment status
    List<Order> findByPaymentStatus(String paymentStatus);
}
