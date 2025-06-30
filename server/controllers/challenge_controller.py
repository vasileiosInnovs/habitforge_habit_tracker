from flask import jsonify, make_response, request, session
from flask_restful import Resource

from server.models import Challenge, db
from server.app import api

class ChallengeList(Resource):
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized. Please log in."}, 401

        data = request.get_json()

        title = data.get('title')
        description = data.get('description')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        errors = {}
        if not title:
            errors['title'] = 'Title is required'
        if not description:
            errors['description'] = 'Description is required'
        if not start_date:
            errors['start_date'] = 'Start date is required'

        if errors:
            return {'errors': errors}, 422

        try:
            new_challenge = Challenge(
                title=title,
                description=description,
                start_date=start_date,
                end_date=end_date,
                user_id=user_id 
            )

            db.session.add(new_challenge)
            db.session.commit()

            response = {
                "id": new_challenge.id,
                "user_id": new_challenge.user_id,
                "title": new_challenge.title,
                "description": new_challenge.description,
                "start_date": new_challenge.start_date,
                "end_date": new_challenge.end_date
            }

            return response, 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 422
        
    def get(self):
        challenges = Challenge.query.all()

        challenge_list = []
        for c in challenges:
            challenge_list.append({
                "id": c.id,
                "user_id": c.user_id,
                "title": c.title,
                "description": c.description,
                "start_date": c.start_date,
                "end_date": c.end_date
            })

        return challenge_list, 200

class ChallengesIndex(Resource):
    def patch(self, id):
        challenge = Challenge.query.get(id)

        if not challenge:
            return jsonify({"error": "Challenge not found"}), 404

        data = request.get_json()

        if "title" in data:
            challenge.title = data.get('title', challenge.title)
        if  "description" in data:
            challenge.description = data.get('description', challenge.description)
        if "start_date" in data:
            challenge.start_date = data.get('start_date', challenge.start_date)
        if "end_date" in data:
            challenge.end_date = data.get('end_date', challenge.end_date)

        try:
            db.session.commit()
            return jsonify({
                "id": challenge.id,
                "title": challenge.title,
                "description": challenge.description,
                "start_date": challenge.start_date,
                "end_date": challenge.end_date
            }), 200
        
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Failed to update challenge."}), 500

    def delete(self, id):
        if session.get('user_id'):
            challenge = Challenge.query.get(id)

            if not challenge:
                return make_response(jsonify({'error': 'Challenge not found'}), 404)

            db.session.delete(challenge)
            db.session.commit()

            return make_response(jsonify({'message': 'Challenge successfully deleted.'}), 204)
        else:
            return make_response(jsonify({'error': 'Unauthorized'}), 401)


