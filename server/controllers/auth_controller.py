from flask import request, session, make_response, jsonify
from flask_restful import Resource

from models import db, User

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
        except:
            response_dict = {"message": "Invalid sign up"}

            return make_response(
                jsonify(response_dict),
                422
            )


