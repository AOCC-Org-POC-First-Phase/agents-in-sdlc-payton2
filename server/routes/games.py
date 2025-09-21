from flask import jsonify, Response, Blueprint, request
from models import db, Game, Publisher, Category
from sqlalchemy.orm import Query
from sqlalchemy.exc import IntegrityError

# Create a Blueprint for games routes
games_bp = Blueprint('games', __name__)

def get_games_base_query() -> Query:
    return db.session.query(Game).join(
        Publisher, 
        Game.publisher_id == Publisher.id, 
        isouter=True
    ).join(
        Category, 
        Game.category_id == Category.id, 
        isouter=True
    )

@games_bp.route('/api/games', methods=['GET'])
def get_games() -> Response:
    # Use the base query for all games
    games_query = get_games_base_query().all()
    
    # Convert the results using the model's to_dict method
    games_list = [game.to_dict() for game in games_query]
    
    return jsonify(games_list)

@games_bp.route('/api/games/<int:id>', methods=['GET'])
def get_game(id: int) -> tuple[Response, int] | Response:
    # Use the base query and add filter for specific game
    game_query = get_games_base_query().filter(Game.id == id).first()
    
    # Return 404 if game not found
    if not game_query: 
        return jsonify({"error": "Game not found"}), 404
    
    # Convert the result using the model's to_dict method
    game = game_query.to_dict()
    
    return jsonify(game)

@games_bp.route('/api/games', methods=['POST'])
def create_game() -> tuple[Response, int] | Response:
    try:
        # Get JSON data from request
        try:
            data = request.get_json()
        except Exception:
            return jsonify({"error": "Invalid JSON data"}), 400
        
        # Validate required fields
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        required_fields = ['title', 'description', 'category_id', 'publisher_id']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
        
        # Validate category and publisher exist
        category = Category.query.get(data['category_id'])
        if not category:
            return jsonify({"error": "Category not found"}), 404
            
        publisher = Publisher.query.get(data['publisher_id'])
        if not publisher:
            return jsonify({"error": "Publisher not found"}), 404
        
        # Validate star rating if provided
        star_rating = data.get('star_rating')
        if star_rating is not None:
            try:
                star_rating = float(star_rating)
                if star_rating < 0 or star_rating > 5:
                    return jsonify({"error": "Star rating must be between 0 and 5"}), 400
            except (ValueError, TypeError):
                return jsonify({"error": "Star rating must be a valid number"}), 400
        
        # Create new game
        game = Game(
            title=data['title'],
            description=data['description'],
            category_id=data['category_id'],
            publisher_id=data['publisher_id'],
            star_rating=star_rating
        )
        
        # Add to database
        db.session.add(game)
        db.session.commit()
        
        # Return created game with relationships loaded
        created_game = get_games_base_query().filter(Game.id == game.id).first()
        return jsonify(created_game.to_dict()), 201
        
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Database constraint violation"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

@games_bp.route('/api/games/<int:id>', methods=['PUT'])
def update_game(id: int) -> tuple[Response, int] | Response:
    try:
        # Find the game to update
        game = Game.query.get(id)
        if not game:
            return jsonify({"error": "Game not found"}), 404
        
        # Get JSON data from request
        try:
            data = request.get_json()
        except Exception:
            return jsonify({"error": "Invalid JSON data"}), 400
            
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Update fields if provided
        if 'title' in data:
            game.title = data['title']
        
        if 'description' in data:
            game.description = data['description']
        
        if 'category_id' in data:
            # Validate category exists
            category = Category.query.get(data['category_id'])
            if not category:
                return jsonify({"error": "Category not found"}), 404
            game.category_id = data['category_id']
        
        if 'publisher_id' in data:
            # Validate publisher exists
            publisher = Publisher.query.get(data['publisher_id'])
            if not publisher:
                return jsonify({"error": "Publisher not found"}), 404
            game.publisher_id = data['publisher_id']
        
        if 'star_rating' in data:
            star_rating = data['star_rating']
            if star_rating is not None:
                try:
                    star_rating = float(star_rating)
                    if star_rating < 0 or star_rating > 5:
                        return jsonify({"error": "Star rating must be between 0 and 5"}), 400
                except (ValueError, TypeError):
                    return jsonify({"error": "Star rating must be a valid number"}), 400
            game.star_rating = star_rating
        
        # Commit changes
        db.session.commit()
        
        # Return updated game with relationships loaded
        updated_game = get_games_base_query().filter(Game.id == game.id).first()
        return jsonify(updated_game.to_dict())
        
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Database constraint violation"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500
@games_bp.route('/api/games/<int:id>', methods=['DELETE'])
def delete_game(id: int) -> tuple[Response, int] | Response:
    try:
        # Find the game to delete
        game = Game.query.get(id)
        if not game:
            return jsonify({"error": "Game not found"}), 404
        
        # Store game data before deletion for response
        game_data = game.to_dict()
        
        # Delete the game
        db.session.delete(game)
        db.session.commit()
        
        return jsonify({
            "message": "Game deleted successfully",
            "deleted_game": game_data
        })
        
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Cannot delete game due to database constraints"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500
