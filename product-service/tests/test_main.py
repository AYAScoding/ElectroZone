from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Test Root Endpoints
def test_read_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "product-service"
    assert "ElectroZone" in response.json()["message"]

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["service"] == "product-service"

# Test Category Endpoints
def test_create_category():
    """Test creating a category"""
    response = client.post(
        "/categories/",
        json={"name": "Test Laptops", "description": "Test laptop category"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Laptops"
    assert "id" in data

def test_read_categories():
    """Test reading all categories"""
    response = client.get("/categories/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_read_category_not_found():
    """Test reading non-existent category"""
    response = client.get("/categories/99999")
    assert response.status_code == 404

# Test Product Endpoints
def test_create_product():
    """Test creating a product"""
    # First create a category
    category_response = client.post(
        "/categories/",
        json={"name": "Test Phones", "description": "Test phone category"}
    )
    category_id = category_response.json()["id"]
    
    # Then create a product
    response = client.post(
        "/products/",
        json={
            "name": "Test iPhone 15",
            "description": "Test phone",
            "price": 999.99,
            "stock_quantity": 10,
            "brand": "Apple",
            "category_id": category_id,
            "specifications": {"RAM": "8GB", "Storage": "256GB"},
            "image_url": "https://example.com/test.jpg"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test iPhone 15"
    assert data["price"] == 999.99
    assert "id" in data

def test_read_products():
    """Test reading all products"""
    response = client.get("/products/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_read_product_not_found():
    """Test reading non-existent product"""
    response = client.get("/products/99999")
    assert response.status_code == 404

def test_search_products():
    """Test product search"""
    response = client.get("/products/search/?q=test")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_filter_by_brand():
    """Test filtering products by brand"""
    response = client.get("/products/brand/Apple")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_available_products():
    """Test getting in-stock products"""
    response = client.get("/products/stock/available")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_product_invalid_category():
    """Test creating product with non-existent category"""
    response = client.post(
        "/products/",
        json={
            "name": "Invalid Product",
            "description": "Test",
            "price": 100.0,
            "stock_quantity": 5,
            "brand": "TestBrand",
            "category_id": 99999  # Non-existent category
        }
    )
    assert response.status_code == 400

def test_pagination():
    """Test pagination parameters"""
    response = client.get("/products/?skip=0&limit=5")
    assert response.status_code == 200
    products = response.json()
    assert len(products) <= 5
