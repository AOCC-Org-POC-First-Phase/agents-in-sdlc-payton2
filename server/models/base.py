"""
Base model for the Tailspin Toys Crowd Funding platform.
This module provides common functionality for all database models.
"""
# filepath: server/models/base.py
from . import db

class BaseModel(db.Model):
    """Base model class that provides common functionality for all database models."""
    __abstract__ = True
    
    @staticmethod
    def validate_string_length(field_name, value, min_length=2, allow_none=False):
        """
        Validate string length and format for model fields.
        
        Args:
            field_name: Name of the field being validated
            value: The value to validate
            min_length: Minimum required length (default: 2)
            allow_none: Whether None values are allowed (default: False)
            
        Returns:
            str: The validated value
            
        Raises:
            ValueError: If validation fails
        """
        if value is None:
            if allow_none:
                return value
            else:
                raise ValueError(f"{field_name} cannot be empty")
        
        if not isinstance(value, str):
            raise ValueError(f"{field_name} must be a string")
            
        if len(value.strip()) < min_length:
            raise ValueError(f"{field_name} must be at least {min_length} characters")
            
        return value