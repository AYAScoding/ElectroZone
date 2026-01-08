# ElectroZone - Product Service

FastAPI-based microservice for managing products and categories in the ElectroZone e-commerce platform.

## Overview

The Product Service handles all product-related operations including inventory management, categorization, search, and filtering for ElectroZone's electronics store (laptops, phones, tablets, accessories).

## Features

- ✅ Complete CRUD operations for products and categories
- ✅ Product search by name and description
- ✅ Filter products by category (Laptops, Phones, Tablets, etc.)
- ✅ Filter products by brand (Apple, Samsung, Dell, HP, etc.)
- ✅ Stock availability checking
- ✅ Inventory management with stock updates
- ✅ RESTful API with automatic documentation
- ✅ PostgreSQL database with SQLAlchemy ORM
- ✅ Input validation with Pydantic schemas
- ✅ Docker containerization
- ✅ Comprehensive unit testing (23 tests)
- ✅ CORS enabled for microservices integration

## Tech Stack

- **Language**: Python 3.12+
- **Framework**: FastAPI
- **Database**: PostgreSQL 17
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Server**: Uvicorn
- **Testing**: PyTest
- **Containerization**: Docker

## Prerequisites

- Python 3.12 or higher
- PostgreSQL 17
- Docker Desktop (for containerized deployment)
- Git

## Installation & Setup

### Option 1: Local Development

#### 1. Clone the Repository

git clone https://github.com/AYAScoding/ElectroZone.git
cd ElectroZone
git checkout product-service

#### 2. Create Virtual Environment

python -m venv venv

Windows
venv\Scripts\activate

Mac/Linux
source venv/bin/activate

#### 3. Install Dependencies

pip install -r requirements.txt

#### 4. Configure Database

Create PostgreSQL database:
CREATE DATABASE "product-service-database";

#### 5. Set Environment Variables

Create a `.env` file in the root directory:

POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=product-service-database

⚠️ **Important**: Never commit the `.env` file to Git!

#### 6. Run the Service

fastapi dev main.py

The service will start at: `http://127.0.0.1:8000`

### Option 2: Docker Deployment (Recommended)

#### 1. Using Docker Compose

Start service with database
docker-compose up --build

Run in background
docker-compose up -d --build

Stop services
docker-compose down

#### 2. Using Docker Only

Build image
docker build -t electrozone-product-service .

Run container
docker run -d -p 8000:8000
-e POSTGRES_USER=postgres
-e POSTGRES_PASSWORD=your_password
-e POSTGRES_HOST=host.docker.internal
-e POSTGRES_PORT=5432
-e POSTGRES_DB=product-service-database
--name product-service
electrozone-product-service

## API Documentation

### Access Interactive Documentation

Once the service is running, visit:

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

### API Endpoints

#### Root & Health

| Method | Endpoint  | Description                     |
| ------ | --------- | ------------------------------- |
| GET    | `/`       | Root endpoint with service info |
| GET    | `/health` | Health check endpoint           |

#### Categories

| Method | Endpoint                    | Description                    | Request Body     |
| ------ | --------------------------- | ------------------------------ | ---------------- |
| POST   | `/categories/`              | Create a new category          | `CategoryCreate` |
| GET    | `/categories/`              | Get all categories (paginated) | -                |
| GET    | `/categories/{category_id}` | Get specific category          | -                |
| PUT    | `/categories/{category_id}` | Update category                | `CategoryUpdate` |
| DELETE | `/categories/{category_id}` | Delete category                | -                |

#### Products

| Method | Endpoint                           | Description              | Parameters                  |
| ------ | ---------------------------------- | ------------------------ | --------------------------- |
| POST   | `/products/`                       | Create a new product     | Body: `ProductCreate`       |
| GET    | `/products/`                       | Get all products         | Query: `skip`, `limit`      |
| GET    | `/products/{product_id}`           | Get specific product     | -                           |
| PUT    | `/products/{product_id}`           | Update product           | Body: `ProductUpdate`       |
| DELETE | `/products/{product_id}`           | Delete product           | -                           |
| GET    | `/products/category/{category_id}` | Get products by category | Query: `skip`, `limit`      |
| GET    | `/products/brand/{brand}`          | Get products by brand    | Query: `skip`, `limit`      |
| GET    | `/products/search/`                | Search products          | Query: `q`, `skip`, `limit` |
| GET    | `/products/stock/available`        | Get in-stock products    | Query: `skip`, `limit`      |
| PATCH  | `/products/{product_id}/stock`     | Update product stock     | Query: `quantity`           |

## Example Usage

### Create a Category

curl -X POST "http://127.0.0.1:8000/categories/"
-H "Content-Type: application/json"
-d '{
"name": "Laptops",
"description": "Laptop computers and notebooks"
}'

### Create a Product

curl -X POST "http://127.0.0.1:8000/products/"
-H "Content-Type: application/json"
-d '{
"name": "MacBook Air M3",
"description": "13-inch laptop with M3 chip, 16GB RAM",
"price": 1299.99,
"stock_quantity": 15,
"brand": "Apple",
"category_id": 1,
"specifications": {
"RAM": "16GB",
"Storage": "512GB SSD",
"Screen": "13.6 inch Liquid Retina"
},
"image_url": "https://example.com/macbook.jpg"
}'

### Search Products

curl "http://127.0.0.1:8000/products/search/?q=macbook"

### Filter by Brand

curl "http://127.0.0.1:8000/products/brand/Apple"

### Update Stock

curl -X PATCH "http://127.0.0.1:8000/products/1/stock?quantity=20"

## Database Schema

### Products Table

| Column         | Type        | Description               |
| -------------- | ----------- | ------------------------- |
| id             | Integer     | Primary key               |
| name           | String(255) | Product name              |
| description    |             | Product description       |
| price          | Float       | Product price             |
| stock_quantity | Integer     | Available quantity        |
| brand          | String(100) | Product brand             |
| category_id    | Integer     | Foreign key to categories |
| specifications | JSON        | Product specifications    |
| image_url      | String(500) | Product image URL         |
| created_at     | DateTime    | Creation timestamp        |
| updated_at     | DateTime    | Last update timestamp     |

### Categories Table

| Column      | Type        | Description            |
| ----------- | ----------- | ---------------------- |
| id          | Integer     | Primary key            |
| name        | String(100) | Category name (unique) |
| description |             | Category description   |

## Project Structure

product-service/
├── main.py # FastAPI application & endpoints
├── database.py # Database configuration
├── models.py # SQLAlchemy models
├── schemas.py # Pydantic schemas
├── crud.py # CRUD operations
├── requirements.txt # Python dependencies
├── Dockerfile # Docker configuration
├── docker-compose.yml # Docker Compose setup
├── .dockerignore # Docker ignore rules
├── .env # Environment variables (not in Git)
├── .gitignore # Git ignore rules
├── tests/ # Unit tests
│ ├── init.py
│ ├── test_main.py
│ └── test_crud.py
└── README.md # This file

## Testing

### Run Unit Tests

Activate virtual environment first
pytest tests/ -v

With coverage
pytest tests/ -v --cov=. --cov-report=html

### Test Results

- **23 unit tests** covering all CRUD operations and API endpoints
- **100% pass rate**

## Integration with Other Services

This service is part of the ElectroZone microservices architecture:

- **Order Service** (Java): Checks product availability and updates stock when orders are placed
- **User Service** (Node.js): Retrieves product information for user browsing
- **API Gateway** (TypeScript): Routes all product-related requests to this service
- **Frontend** (React): Displays products and allows users to browse the catalog

### Inter-Service Communication

- Uses RESTful APIs for synchronous communication
- CORS enabled for cross-origin requests
- Designed to work behind an API Gateway

## Security

- Environment variables for sensitive data
- Input validation with Pydantic
- SQL injection protection via SQLAlchemy ORM
- CORS middleware configured
- Ready for JWT authentication via API Gateway

## Performance

- Pagination support for large datasets
- Database indexing on frequently queried fields
- Efficient JSON storage for product specifications
- Lightweight Docker image (~96MB)

## Troubleshooting

### Common Issues

**1. Database Connection Error**
sqlalchemy.exc.OperationalError: connection refused

**Solution**: Ensure PostgreSQL is running and `.env` credentials are correct.

**2. Port Already in Use**
Error: Port 8000 is already allocated

**Solution**: Stop other services using port 8000 or change the port in docker-compose.yml.

**3. Module Not Found**
ModuleNotFoundError: No module named 'fastapi'

**Solution**: Activate virtual environment and run `pip install -r requirements.txt`.

## Development Team

- **Developer**: AYAScoding
- **Service**: Product Service (Python/FastAPI)
- **Repository**: https://github.com/AYAScoding/ElectroZone
- **Branch**: product-service

## Timeline

- **Start Date**: November 24, 2025
- **Core Development**: November 24-29, 2025
- **Docker & Testing**: November 29-30, 2025
- **Status**: ✅ Development Complete - Ready for Integration
- **Final Deadline**: January 5, 2026

## Future Enhancements

- [ ] Elasticsearch integration for advanced search
- [ ] Redis caching for frequently accessed products
- [ ] Product image upload functionality
- [ ] Price history tracking
- [ ] Product reviews and ratings
- [ ] Advanced filtering (price range, multiple attributes)
- [ ] Bulk import/export functionality

## License

Part of the ElectroZone SFWE415 Term Project (Fall 2025-26)

## Contact

For questions or issues related to the Product Service, please contact the development team or create an issue in the GitHub repository.
