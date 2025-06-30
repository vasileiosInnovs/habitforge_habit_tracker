from flask import request, session, make_response, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from server.models import db, User


class SignUp(Resource):
    def post(self):
        data = request.get_json()

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        image_url = data.get('image_url')
        bio = data.get('bio')

        if not username or not email or not password:
            return {"error": "Username, email, and password are required."}, 400

        if User.query.filter_by(email=email).first():
            return {"error": "Email already exists."}, 409

        try:
            new_user = User(
                username=username,
                email=email,
                image_url=image_url,
                bio=bio
            )
            new_user.password = password

            db.session.add(new_user)
            db.session.commit()

            session["user_id"] = new_user.id

            return make_response(jsonify(new_user.to_dict()), 201)

        except IntegrityError:
            db.session.rollback()
            return {"error": "Username or email already taken"}, 409


class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id:
            user = User.query.get(user_id)
            if user:
                return {
                    "username": user.username,
                    "image_url": user.image_url,
                    "bio": user.bio
                }, 200
            return {"error": "User not found"}, 404

        return {"error": "Not logged in"}, 401


class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.check_pass(password):
            session['user_id'] = user.id
            return {
                "username": user.username,
                "image_url": user.image_url,
                "bio": user.bio
            }, 200

        return {"error": "Username or password is incorrect."}, 401


class Logout(Resource):
    def delete(self):
        if session.get('user_id'):
            session.pop('user_id')
            return {"message": "Logged out successfully."}, 204

        return {"error": "Unauthorized"}, 401
