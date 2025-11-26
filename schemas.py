from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Category Schemas
class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None

class Category(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True  # Allows Pydantic to read SQLAlchemy models

# Product Schemas
class ProductBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    price: float = Field(..., gt=0)  # Must be greater than 0
    stock_quantity: int = Field(default=0, ge=0)  # Must be >= 0
    brand: Optional[str] = Field(None, max_length=100)
    category_id: int
    specifications: Optional[dict] = None  # {"RAM": "8GB", "Storage": "256GB"}
    image_url: Optional[str] = Field(None, max_length=500)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)
    brand: Optional[str] = Field(None, max_length=100)
    category_id: Optional[int] = None
    specifications: Optional[dict] = None
    image_url: Optional[str] = Field(None, max_length=500)

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[Category] = None
    
    class Config:
        from_attributes = True
