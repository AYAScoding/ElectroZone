from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas

# ==================== Category CRUD Operations ====================

def get_category(db: Session, category_id: int):
    """Get a single category by ID"""
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def get_category_by_name(db: Session, name: str):
    """Get a category by name"""
    return db.query(models.Category).filter(models.Category.name == name).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    """Get all categories with pagination"""
    return db.query(models.Category).offset(skip).limit(limit).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    """Create a new category"""
    db_category = models.Category(
        name=category.name,
        description=category.description
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: int, category: schemas.CategoryUpdate):
    """Update an existing category"""
    db_category = get_category(db, category_id)
    if db_category:
        update_data = category.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_category, key, value)
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    """Delete a category"""
    db_category = get_category(db, category_id)
    if db_category:
        db.delete(db_category)
        db.commit()
        return True
    return False

# ==================== Product CRUD Operations ====================

def get_product(db: Session, product_id: int):
    """Get a single product by ID"""
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    """Get all products with pagination"""
    return db.query(models.Product).offset(skip).limit(limit).all()

def get_products_by_category(db: Session, category_id: int, skip: int = 0, limit: int = 100):
    """Get products filtered by category"""
    return db.query(models.Product).filter(
        models.Product.category_id == category_id
    ).offset(skip).limit(limit).all()

def get_products_by_brand(db: Session, brand: str, skip: int = 0, limit: int = 100):
    """Get products filtered by brand (for ElectroZone: Apple, Samsung, Dell, etc.)"""
    return db.query(models.Product).filter(
        models.Product.brand == brand
    ).offset(skip).limit(limit).all()

def search_products(db: Session, search_term: str, skip: int = 0, limit: int = 100):
    """Search products by name or description"""
    search_pattern = f"%{search_term}%"
    return db.query(models.Product).filter(
        (models.Product.name.ilike(search_pattern)) |
        (models.Product.description.ilike(search_pattern))
    ).offset(skip).limit(limit).all()

def get_products_in_stock(db: Session, skip: int = 0, limit: int = 100):
    """Get products that are in stock (quantity > 0)"""
    return db.query(models.Product).filter(
        models.Product.stock_quantity > 0
    ).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    """Create a new product"""
    db_product = models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        stock_quantity=product.stock_quantity,
        brand=product.brand,
        category_id=product.category_id,
        specifications=product.specifications,
        image_url=product.image_url
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductUpdate):
    """Update an existing product"""
    db_product = get_product(db, product_id)
    if db_product:
        update_data = product.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def update_product_stock(db: Session, product_id: int, quantity: int):
    """Update product stock quantity (useful for order processing)"""
    db_product = get_product(db, product_id)
    if db_product:
        db_product.stock_quantity = quantity
        db.commit()
        db.refresh(db_product)
    return db_product

def decrease_product_stock(db: Session, product_id: int, quantity: int):
    """Decrease product stock quantity (for order processing). Returns None if insufficient stock."""
    db_product = get_product(db, product_id)
    if db_product and db_product.stock_quantity >= quantity:
        db_product.stock_quantity -= quantity
        db.commit()
        db.refresh(db_product)
        return db_product
    return None

def delete_product(db: Session, product_id: int):
    """Delete a product"""
    db_product = get_product(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False
