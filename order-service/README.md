# Order Service

Order Service is a Spring Boot microservice responsible for managing orders in the ElectroZone e‑commerce platform. It stores orders in MySQL and exposes a payment endpoint that creates Stripe PaymentIntents for checkout.[file:123][web:143]

## Features

- Create, read, update, and delete orders.
- Filter orders by user and status.
- Update order status and payment status.
- Trigger Stripe payment for an order via PaymentIntent.[file:123][web:155]

## Tech Stack

- Java 17
- Spring Boot 3
- Spring Data JPA / Hibernate
- MySQL
- Stripe Java SDK (PaymentIntents API)[file:123][web:155]

## Configuration

Configure the service in `src/main/resources/application.properties`:

```
spring.application.name=order-service
server.port=8082

# MySQL
spring.datasource.url=jdbc:mysql://localhost:3307/order_service_db
spring.datasource.username=root
spring.datasource.password=SQL@4PASSword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Stripe
stripe.secret-key=${STRIPE_SECRET_KEY}
stripe.currency=usd
```

Set the Stripe secret key before running:

```
$env:STRIPE_SECRET_KEY="sk_test_your_real_key_here"
```

## Running the Service

From the `order-service` directory:

```
./mvnw spring-boot:run
```

The service will start on `http://localhost:8082`.[file:123]

## REST API

Base path: `/api/orders`

| Method | Path                              | Description                           |
| ------ | --------------------------------- | ------------------------------------- |
| POST   | `/api/orders`                     | Create a new order                    |
| GET    | `/api/orders`                     | Get all orders                        |
| GET    | `/api/orders/{id}`                | Get order by ID                       |
| GET    | `/api/orders/user/{userId}`       | Get orders by user ID                 |
| GET    | `/api/orders/status/{status}`     | Get orders by status                  |
| PUT    | `/api/orders/{id}/status`         | Update order status                   |
| PUT    | `/api/orders/{id}/payment-status` | Update payment status                 |
| PUT    | `/api/orders/{id}/cancel`         | Cancel order                          |
| DELETE | `/api/orders/{id}`                | Delete order                          |
| POST   | `/api/orders/{id}/pay`            | Create Stripe PaymentIntent for order |

### Example: Create Order

```
POST /api/orders
Content-Type: application/json

{
  "userId": 1,
  "productId": 1,
  "quantity": 1,
  "totalAmount": 29.99,
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "paymentMethod": "CARD",
  "shippingAddress": "Some street 1, City"
}
```

Response: `201 Created` with the persisted order including `id` and `orderDate`.[file:123]

### Example: Pay for Order

```
POST /api/orders/{id}/pay
```

- Creates a Stripe PaymentIntent for the specified order amount and returns its `client_secret`.
- The frontend uses the `client_secret` with Stripe.js to complete the payment.[web:155][web:157]

## Notes

- Make sure MySQL is running and reachable on the configured host and port.
- In production, store `STRIPE_SECRET_KEY` in a secure environment variable, not in the properties file.
