package com.example.order_service.service;

import com.example.order_service.model.Order;
import com.example.order_service.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order order;

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setId(1L);
        order.setUserId("1");
        order.setProductId(101L);
        order.setQuantity(2);
        order.setTotalAmount(99.99);
        order.setStatus("PENDING");
        order.setPaymentStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());
    }

    @Test
    void givenOrder_whenCreateOrder_thenReturnsSavedOrder() {
        // given
        given(orderRepository.save(any(Order.class))).willReturn(order);

        // when
        Order savedOrder = orderService.createOrder(order);

        // then
        assertThat(savedOrder).isNotNull();
        assertThat(savedOrder.getId()).isEqualTo(1L);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void whenGetAllOrders_thenReturnsOrderList() {
        // given
        List<Order> orders = Arrays.asList(order);
        given(orderRepository.findAll()).willReturn(orders);

        // when
        List<Order> result = orderService.getAllOrders();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    void givenId_whenGetOrderById_thenReturnsOrder() {
        // given
        given(orderRepository.findById(1L)).willReturn(Optional.of(order));

        // when
        Optional<Order> result = orderService.getOrderById(1L);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        verify(orderRepository, times(1)).findById(1L);
    }

    @Test
    void givenIdAndStatus_whenUpdateOrderStatus_thenStatusIsUpdated() {
        // given
        given(orderRepository.findById(1L)).willReturn(Optional.of(order));
        given(orderRepository.save(any(Order.class))).willReturn(order);

        // when
        Order updated = orderService.updateOrderStatus(1L, "CONFIRMED");

        // then
        assertThat(updated).isNotNull();
        assertThat(updated.getStatus()).isEqualTo("CONFIRMED");
        verify(orderRepository, times(1)).findById(1L);
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void givenId_whenDeleteOrder_thenRepositoryDeleteIsCalled() {
        // given
        given(orderRepository.existsById(1L)).willReturn(true);

        // when
        boolean result = orderService.deleteOrder(1L);

        // then
        assertThat(result).isTrue();
        verify(orderRepository, times(1)).deleteById(1L);
    }
}
