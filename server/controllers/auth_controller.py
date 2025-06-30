from flask import request, session, make_response, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from server.models import db, User
from server.app import api

class SignUp(Resource):
    def post(self):
        try:
           data = request.get_json()

           username = data.get('username')
           email = data.get('email')
           password = data.get('password')
           image_url = data.get('image_url')
           bio = data.get('bio')

           if not username or not password or not email:
               return {
                    'error': 'Username, password and email are required.'
               }
           
           if User.query.filter_by(email=email).first():
                return {"error": "Email already exists."}, 400
           
           new_user = User(
               username=username,
               email=email,
               image_url=image_url,
               bio=bio
           )
           new_user.password = password

           db.session.add(new_user)
           db.session.commit()

           session['user_id'] = new_user.id

           new_user_dict = new_user.to_dict()

           return make_response(
               jsonify(new_user_dict),
               201
           )
        except IntegrityError:
            db.session.rollback()
            response_dict = {"message": "Invalid sign up"}
            return make_response(
                jsonify(response_dict),
                409
            )
        
class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id:
            user = User.query.get(user_id)
            if user:
                return jsonify({
                    "username": user.username,
                    "image URL": user.image_url,
                    "bio": user.bio
                }), 200
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
                "image URL": user.image_url,
                "bio": user.bio
            }, 200
        
        else:
            return {
                "error": "Username or password is incorrect."
            }, 401
        
class Logout(Resource):
    def delete(self):

        if session.get('user_id'):
            session.pop('user_id')

            response = {"message": " "}

            return make_response(
                jsonify(response),
                204
            )
        
        else:
            response = {"error": "Unauthorized!"}

            return make_response(jsonify(response), 401)