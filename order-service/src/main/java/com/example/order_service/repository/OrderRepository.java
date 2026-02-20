package com.example.order_service.repository;

import com.example.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(String userId);

    List<Order> findByStatus(String status);

    List<Order> findByUserIdAndStatus(String userId, String status);

    List<Order> findByPaymentStatus(String paymentStatus);
}
