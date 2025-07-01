from flask import request, session
from flask_restful import Resource
from datetime import datetime

from server.models import db, Participation
from server.app import api


class ParticipationList(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Unauthorized'}, 401
        participations = Participation.query.filter_by(user_id=user_id).all()
        result = []
        for p in participations:
            challenge = p.challenge
            result.append({
                "id": p.id,
                "challenge_id": p.challenge_id,
                "join_date": p.join_date.isoformat(),
                "title": challenge.title,
                "description": challenge.description,
                "start_date": challenge.start_date.isoformat() if challenge.start_date else None,
                "end_date": challenge.end_date.isoformat() if challenge.end_date else None,
                "creator_name": challenge.user.username if challenge.user else "Unknown"
            })
        return result, 200

    
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {
                'error': 'Unauthorized'
            }, 401
        
        data = request.get_json()
        challenge_id = data.get('challenge_id')

        if not challenge_id:
            return {'error': 'Challenge ID is required'}, 422
        
        existing = Participation.query.filter_by(user_id=user_id, challenge_id=challenge_id).first()
        if existing:
            return {'error': 'Already participating in this challenge'}, 409
        
        new_participation = Participation(
            user_id=user_id,
            challenge_id=challenge_id,
            join_date=datetime.now()
        )

        try:
            db.session.add(new_participation)
            db.session.commit()
            return {'message': 'Joined challenge'}, 201
        
        except:
            db.session.rollback()
            return {'error': 'Could not join challenge'}, 500
        
class ParticipationIndex(Resource):
    def delete(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Unauthorized'}, 401
        
        participation = Participation.query.get(id)
        if not participation or participation.user_id != user_id:
            return {'error': 'Participation not found'}, 404
        
        try:
            db.session.delete(participation)
            db.session.commit()
            return {'message': 'Left challenge'}, 200
        except:
            db.session.rollback()
            return {'error': 'Could not leave challenge'}, 500
        
    def patch(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Unauthorized'}, 401

        participation = Participation.query.get(id)
        if not participation or participation.user_id != user_id:
            return {'error': 'Participation not found'}, 404


        try:
            db.session.commit()
            return {
                'message': 'Participation updated',
                'id': participation.id
            }, 200

        
        except:
            db.session.rollback()
            return {'error': 'Error in updating'}, 500
