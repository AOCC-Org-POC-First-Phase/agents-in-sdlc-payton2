"""
Game model for the Tailspin Toys Crowd Funding platform.
This module defines the Game model for managing game information in the database.
"""
from . import db
from .base import BaseModel
from sqlalchemy.orm import validates, relationship

class Game(BaseModel):
    """Model representing a game in the crowd funding platform."""
    __tablename__ = 'games'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    star_rating = db.Column(db.Float, nullable=True)
    
    # Foreign keys for one-to-many relationships
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    publisher_id = db.Column(db.Integer, db.ForeignKey('publishers.id'), nullable=False)
    
    # One-to-many relationships (many games belong to one category/publisher)
    category = relationship("Category", back_populates="games")
    publisher = relationship("Publisher", back_populates="games")
    
    @validates('title')
    def validate_name(self, key, name):
        """
        Validate game title field.
        
        Args:
            key: The field name being validated
            name: The title value to validate
            
        Returns:
            str: The validated title
            
        Raises:
            ValueError: If title validation fails
        """
        return self.validate_string_length('Game title', name, min_length=2)
    
    @validates('description')
    def validate_description(self, key, description):
        """
        Validate game description field.
        
        Args:
            key: The field name being validated
            description: The description value to validate
            
        Returns:
            str: The validated description
            
        Raises:
            ValueError: If description validation fails
        """
        if description is not None:
            return self.validate_string_length('Description', description, min_length=10, allow_none=True)
        return description
    
    def __repr__(self):
        """
        Return string representation of the game.
        
        Returns:
            str: String representation showing game title and ID
        """
        return f'<Game {self.title}, ID: {self.id}>'

    def to_dict(self):
        """
        Convert game instance to dictionary representation.
        
        Returns:
            dict: Dictionary containing game data suitable for JSON serialization
        """
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'publisher': {'id': self.publisher.id, 'name': self.publisher.name} if self.publisher else None,
            'category': {'id': self.category.id, 'name': self.category.name} if self.category else None,
            'starRating': self.star_rating  # Changed from star_rating to starRating
        }