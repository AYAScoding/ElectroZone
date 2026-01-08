import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
import models
import schemas
import crud

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db():
    """Create test database and tables"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

# Test Category CRUD
def test_create_category(db):
    """Test creating a category"""
    category_data = schemas.CategoryCreate(name="Tablets", description="Tablet devices")
    category = crud.create_category(db, category_data)
    assert category.name == "Tablets"
    assert category.id is not None

def test_get_category(db):
    """Test getting a category by ID"""
    category_data = schemas.CategoryCreate(name="Accessories", description="Tech accessories")
    created_category = crud.create_category(db, category_data)
    
    retrieved_category = crud.get_category(db, created_category.id)
    assert retrieved_category is not None
    assert retrieved_category.name == "Accessories"

def test_get_categories(db):
    """Test getting all categories"""
    crud.create_category(db, schemas.CategoryCreate(name="Cat1", description="Desc1"))
    crud.create_category(db, schemas.CategoryCreate(name="Cat2", description="Desc2"))
    
    categories = crud.get_categories(db)
    assert len(categories) >= 2

def test_update_category(db):
    """Test updating a category"""
    category_data = schemas.CategoryCreate(name="Old Name", description="Old desc")
    created_category = crud.create_category(db, category_data)
    
    update_data = schemas.CategoryUpdate(name="New Name", description="New desc")
    updated_category = crud.update_category(db, created_category.id, update_data)
    
    assert updated_category.name == "New Name"
    assert updated_category.description == "New desc"

def test_delete_category(db):
    """Test deleting a category"""
    category_data = schemas.CategoryCreate(name="ToDelete", description="Will be deleted")
    created_category = crud.create_category(db, category_data)
    
    result = crud.delete_category(db, created_category.id)
    assert result is True
    
    deleted_category = crud.get_category(db, created_category.id)
    assert deleted_category is None

# Test Product CRUD
def test_create_product(db):
    """Test creating a product"""
    # First create a category
    category = crud.create_category(db, schemas.CategoryCreate(name="Laptops", description="Laptop category"))
    
    # Then create a product
    product_data = schemas.ProductCreate(
        name="Dell XPS 13",
        description="High-end laptop",
        price=1299.99,
        stock_quantity=5,
        brand="Dell",
        category_id=category.id,
        specifications={"RAM": "16GB", "Storage": "512GB"},
        image_url="https://example.com/dell.jpg"
    )
    product = crud.create_product(db, product_data)
    
    assert product.name == "Dell XPS 13"
    assert product.price == 1299.99
    assert product.brand == "Dell"
    assert product.id is not None

def test_get_product(db):
    """Test getting a product by ID"""
    category = crud.create_category(db, schemas.CategoryCreate(name="Phones", description="Phone category"))
    product_data = schemas.ProductCreate(
        name="Samsung Galaxy",
        description="Android phone",
        price=899.99,
        stock_quantity=10,
        brand="Samsung",
        category_id=category.id
    )
    created_product = crud.create_product(db, product_data)
    
    retrieved_product = crud.get_product(db, created_product.id)
    assert retrieved_product is not None
    assert retrieved_product.name == "Samsung Galaxy"

def test_search_products(db):
    """Test searching products"""
    category = crud.create_category(db, schemas.CategoryCreate(name="Search Test", description="Test"))
    
    crud.create_product(db, schemas.ProductCreate(
        name="iPhone 15 Pro",
        description="Apple smartphone",
        price=1199.99,
        stock_quantity=8,
        brand="Apple",
        category_id=category.id
    ))
    
    results = crud.search_products(db, "iPhone")
    assert len(results) > 0
    assert "iPhone" in results[0].name

def test_get_products_by_brand(db):
    """Test filtering products by brand"""
    category = crud.create_category(db, schemas.CategoryCreate(name="Brand Test", description="Test"))
    
    crud.create_product(db, schemas.ProductCreate(
        name="HP Laptop",
        description="HP device",
        price=799.99,
        stock_quantity=3,
        brand="HP",
        category_id=category.id
    ))
    
    results = crud.get_products_by_brand(db, "HP")
    assert len(results) > 0
    assert results[0].brand == "HP"

def test_update_product_stock(db):
    """Test updating product stock"""
    category = crud.create_category(db, schemas.CategoryCreate(name="Stock Test", description="Test"))
    product_data = schemas.ProductCreate(
        name="Stock Product",
        description="Test product",
        price=100.0,
        stock_quantity=10,
        brand="TestBrand",
        category_id=category.id
    )
    product = crud.create_product(db, product_data)
    
    updated_product = crud.update_product_stock(db, product.id, 5)
    assert updated_product.stock_quantity == 5
