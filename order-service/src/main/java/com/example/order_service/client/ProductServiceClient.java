package com.example.order_service.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;

@Slf4j
@Service
public class ProductServiceClient {

    private final RestTemplate restTemplate;

    @Value("${product.service.url:http://localhost:8000}")
    private String productServiceUrl;

    public ProductServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostConstruct
    public void init() {
        log.info("ProductServiceClient initialized with URL: {}", productServiceUrl);
    }

    public void decreaseStock(Long productId, Integer quantity) {
        String url = productServiceUrl + "/products/" + productId + "/stock/decrease?qty=" + quantity;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            log.debug("Attempting to decrease stock for product {}: quantity {}", productId, quantity);
            restTemplate.patchForObject(url, entity, Object.class);
            log.info("Successfully decreased stock for product {}", productId);
        } catch (Exception e) {
            // Log error with SLF4J
            log.error("Failed to decrease stock for product {}. Reason: {}", productId, e.getMessage());
        }
    }
}
