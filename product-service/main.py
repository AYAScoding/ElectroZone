from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import crud
from database import engine, get_db, Base
from fastapi.middleware.cors import CORSMiddleware 

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ElectroZone Product Service",
    description="Product management service for ElectroZone electronics store",
    version="1.0.0"
)

# Add CORS middleware for cross-service communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Root & Health Endpoints ====================

@app.get("/")
async def root():
    return {"message": "ElectroZone Product Service is running", "service": "product-service"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "product-service"}

# ==================== Category Endpoints ====================

@app.post("/categories/", response_model=schemas.Category, status_code=status.HTTP_201_CREATED)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    """Create a new product category (e.g., Phones, Laptops, Tablets)"""
    db_category = crud.get_category_by_name(db, name=category.name)
    if db_category:
        raise HTTPException(status_code=400, detail="Category already exists")
    return crud.create_category(db=db, category=category)

@app.get("/categories/", response_model=List[schemas.Category])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all categories"""
    categories = crud.get_categories(db, skip=skip, limit=limit)
    return categories

@app.get("/categories/{category_id}", response_model=schemas.Category)
def read_category(category_id: int, db: Session = Depends(get_db)):
    """Get a specific category by ID"""
    db_category = crud.get_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@app.put("/categories/{category_id}", response_model=schemas.Category)
def update_category(category_id: int, category: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    """Update a category"""
    db_category = crud.update_category(db, category_id=category_id, category=category)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@app.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    """Delete a category"""
    success = crud.delete_category(db, category_id=category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return None

# ==================== Product Endpoints ====================

@app.post("/products/", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    """Create a new product (e.g., iPhone 15 Pro, MacBook Air)"""
    # Verify category exists
    db_category = crud.get_category(db, category_id=product.category_id)
    if not db_category:
        raise HTTPException(status_code=400, detail="Category does not exist")
    return crud.create_product(db=db, product=product)

@app.get("/products/", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all products"""
    products = crud.get_products(db, skip=skip, limit=limit)
    return products

@app.get("/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    """Get a specific product by ID"""
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.get("/products/category/{category_id}", response_model=List[schemas.Product])
def read_products_by_category(category_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all products in a specific category (e.g., all Laptops)"""
    products = crud.get_products_by_category(db, category_id=category_id, skip=skip, limit=limit)
    return products

@app.get("/products/brand/{brand}", response_model=List[schemas.Product])
def read_products_by_brand(brand: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all products by brand (e.g., Apple, Samsung, Dell)"""
    products = crud.get_products_by_brand(db, brand=brand, skip=skip, limit=limit)
    return products

@app.get("/products/search/", response_model=List[schemas.Product])
def search_products(q: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Search products by name or description"""
    products = crud.search_products(db, search_term=q, skip=skip, limit=limit)
    return products

@app.get("/products/stock/available", response_model=List[schemas.Product])
def read_available_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get only products that are in stock"""
    products = crud.get_products_in_stock(db, skip=skip, limit=limit)
    return products

@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    """Update a product"""
    db_product = crud.update_product(db, product_id=product_id, product=product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.patch("/products/{product_id}/stock")
def update_product_stock(product_id: int, quantity: int, db: Session = Depends(get_db)):
    """Update product stock quantity (for order processing)"""
    db_product = crud.update_product_stock(db, product_id=product_id, quantity=quantity)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Stock updated successfully", "product_id": product_id, "new_quantity": quantity}

@app.patch("/products/{product_id}/stock/decrease")
def decrease_product_stock(product_id: int, qty: int, db: Session = Depends(get_db)):
    """Decrease product stock quantity (for order processing)"""
    db_product = crud.decrease_product_stock(db, product_id=product_id, quantity=qty)
    if db_product is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Insufficient stock or product not found"
        )
    return {"message": "Stock decreased successfully", "product_id": product_id, "new_quantity": db_product.stock_quantity}

@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product"""
    success = crud.delete_product(db, product_id=product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return None
