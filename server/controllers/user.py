from flask import session, jsonify, request
from flask_restful import Resource

from server.models import User, db
from server.app import api

class Profile(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "bio": user.bio,
            "image_url": user.image_url
        })

    def patch(self):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        user.username = data.get("username", user.username)
        user.email = data.get("email", user.email)
        user.bio = data.get("bio", user.bio)
        user.image_url = data.get("image_url", user.image_url)

        db.session.commit()

        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "bio": user.bio,
            "image_url": user.image_url
        })