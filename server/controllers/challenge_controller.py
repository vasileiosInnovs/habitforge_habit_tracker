from datetime import datetime
from flask import jsonify, make_response, request, session
from flask_restful import Resource

from server.models import Challenge, db
from server.app import api
from server.models.participation import Participation
from server.models.user import User

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
                start_date=datetime.fromisoformat(start_date) if start_date else datetime.now(),
                end_date=datetime.fromisoformat(end_date) if end_date else None,
                user_id=user_id 
            )

            db.session.add(new_challenge)
            db.session.commit()

            creator = User.query.get(user_id)

            response = {
                "id": new_challenge.id,
                "user_id": new_challenge.user_id,
                "title": new_challenge.title,
                "description": new_challenge.description,
                "start_date": new_challenge.start_date.isoformat() if new_challenge.start_date else None,
                "end_date": new_challenge.end_date.isoformat() if new_challenge.end_date else None,
                "creator_name": creator.username if creator else "Unknown",
                "participant_count": 0
            }

            return response, 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 422
        
    def get(self):
        try:
            current_user_id = session.get("user_id")
            challenges = Challenge.query.all()

            challenge_list = []
            for c in challenges:
                creator = User.query.get(c.user_id)

                participant_count = Participation.query.filter_by(challenge_id=c.id).count()

                user_joined = False
                if current_user_id:
                    user_participation = Participation.query.filter_by(
                        challenge_id=c.id,
                        user_id=current_user_id
                    ).first()
                    user_joined = user_participation is not None


                challenge_data = {
                    "id": c.id,
                    "user_id": c.user_id,
                    "title": c.title,
                    "description": c.description,
                    "start_date": c.start_date,
                    "end_date": c.end_date,
                    "creator_name": creator.username if creator else "Unknown",
                    "user_joined": user_joined
                }
                challenge_list.append(challenge_data)

            return challenge_list, 200
        except Exception as e:
            return {'error': str(e)}, 500

class ChallengesIndex(Resource):
    def patch(self, id):
        
        user_id = session.get("user_id")
        if not user_id:
            return {'error': 'Unauthorized'}, 401
        
        challenge = Challenge.query.get(id)

        if not challenge:
            return jsonify({"error": "Challenge not found"}), 404

        data = request.get_json()

        if "title" in data:
            challenge.title = data.get('title', challenge.title)
        if  "description" in data:
            challenge.description = data.get('description', challenge.description)
        if "start_date" in data:
            challenge.start_date = datetime.fromisoformat(data['start_date']) if data['start_date'] else challenge.start_date
        if "end_date" in data:
            challenge.end_date = datetime.fromisoformat(data['end_date']) if data['end_date'] else challenge.end_date

        try:
            db.session.commit()
            return jsonify({
                "id": challenge.id,
                "title": challenge.title,
                "description": challenge.description,
                "start_date": challenge.start_date.isoformat() if challenge.start_date else None,
                "end_date": challenge.end_date.isoformat() if challenge.end_date else None
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
        
class ChallengeParticipation(Resource):
    def post(self, challenge_id):
        """Join a challenge"""
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized. Please log in."}, 401

        challenge = Challenge.query.get(challenge_id)
        if not challenge:
            return {"error": "Challenge not found"}, 404

        if challenge.user_id == user_id:
            return {"error": "You cannot join your own challenge"}, 400

        existing_participation = Participation.query.filter_by(
            challenge_id=challenge_id, 
            user_id=user_id
        ).first()
        
        if existing_participation:
            return {"error": "You have already joined this challenge"}, 400
        
        data = request.get_json()

        try:
            participation = Participation(
                challenge_id=challenge_id,
                user_id=user_id,
                reason_for_joining=data.get("reason_for_joining"),
                personal_goal=data.get("personal_goal"),
                join_date=datetime.now()
            )
            
            db.session.add(participation)
            db.session.commit()
            
            return {"message": "Successfully joined challenge"}, 201
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    def delete(self, challenge_id):
        """Leave a challenge"""
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        participation = Participation.query.filter_by(
            challenge_id=challenge_id, 
            user_id=user_id
        ).first()
        
        if not participation:
            return {"error": "You are not participating in this challenge"}, 404

        try:
            db.session.delete(participation)
            db.session.commit()
            return {"message": "Successfully left challenge"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": "Failed to leave challenge"}, 500

class MyDayChallenges(Resource):
    def get(self):
        """Get challenges the current user has joined"""
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        try:
            participations = Participation.query.filter_by(user_id=user_id).all()
            
            joined_challenges = []
            for participation in participations:
                challenge = participation.challenge
                creator = User.query.get(challenge.user_id)
                
                challenge_data = {
                    "id": challenge.id,
                    "title": challenge.title,
                    "description": challenge.description,
                    "start_date": challenge.start_date.isoformat() if challenge.start_date else None,
                    "end_date": challenge.end_date.isoformat() if challenge.end_date else None,
                    "creator_name": creator.username if creator else "Unknown",
                    "join_date": participation.join_date.isoformat() if participation.join_date else None
                }
                joined_challenges.append(challenge_data)

            return joined_challenges, 200
        except Exception as e:
            return {"error": str(e)}, 500