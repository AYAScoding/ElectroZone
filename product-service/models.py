from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)  # "iPhone 15 Pro"
    description = Column(Text)  # Product details
    price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, default=0)
    brand = Column(String(100))  # "Apple", "Samsung", "Dell"
    category_id = Column(Integer, ForeignKey("categories.id"))
    specifications = Column(JSON)  # {"RAM": "8GB", "Storage": "256GB"}
    image_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    category = relationship("Category", back_populates="products")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)  # "Laptops", "Phones"
    description = Column(Text)
    
    products = relationship("Product", back_populates="category")
