package com.example.order_service.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;

@Service
public class ProductServiceClient {

    private RestTemplate restTemplate;

    @Value("${product.service.url:http://localhost:8000}")
    private String productServiceUrl;

    @PostConstruct
    public void init() {
        // Use a customized factory to support PATCH requests if needed,
        // though default RestTemplate sometimes struggles with PATCH on older versions.
        // Spring Boot 3.2 usually works fine with standard RestTemplate for PATCH if
        // configured.
        this.restTemplate = new RestTemplate();
    }

    public void decreaseStock(Long productId, Integer quantity) {
        String url = productServiceUrl + "/products/" + productId + "/stock/decrease?qty=" + quantity;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // Using PATCH for stock decrease
            restTemplate.patchForObject(url, entity, Object.class);
        } catch (Exception e) {
            // Log error but don't fail the order creation for now to avoid blocking user
            System.err.println("Failed to decrease stock for product " + productId + ": " + e.getMessage());
        }
    }
}
