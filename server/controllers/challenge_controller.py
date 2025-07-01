from datetime import datetime
from flask import jsonify, make_response, request, session
from flask_restful import Resource
from server.models import Challenge, db
from server.models.participation import Participation
from server.models.user import User


class ChallengeList(Resource):
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized. Please log in."}, 401

        data = request.get_json()

        title = data.get("title")
        description = data.get("description")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        errors = {}
        if not title:
            errors["title"] = "Title is required"
        if not description:
            errors["description"] = "Description is required"
        if not start_date:
            errors["start_date"] = "Start date is required"

        if errors:
            return {"errors": errors}, 422

        try:
            new_challenge = Challenge(
                title=title,
                description=description,
                start_date=datetime.fromisoformat(start_date),
                end_date=datetime.fromisoformat(end_date) if end_date else None,
                user_id=user_id,
            )

            db.session.add(new_challenge)
            db.session.commit()

            creator = User.query.get(user_id)

            return {
                "id": new_challenge.id,
                "user_id": new_challenge.user_id,
                "title": new_challenge.title,
                "description": new_challenge.description,
                "start_date": new_challenge.start_date.isoformat(),
                "end_date": new_challenge.end_date.isoformat() if new_challenge.end_date else None,
                "creator_name": creator.username if creator else "Unknown",
                "participant_count": 0,
            }, 201

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 422

    def get(self):
        user_id = session.get("user_id")

        try:
            challenges = Challenge.query.all()
            result = []

            for c in challenges:
                creator = User.query.get(c.user_id)
                participant_count = Participation.query.filter_by(challenge_id=c.id).count()
                user_joined = False

                if user_id:
                    user_joined = Participation.query.filter_by(
                        challenge_id=c.id, user_id=user_id
                    ).first() is not None

                result.append({
                    "id": c.id,
                    "user_id": c.user_id,
                    "title": c.title,
                    "description": c.description,
                    "start_date": c.start_date.isoformat() if c.start_date else None,
                    "end_date": c.end_date.isoformat() if c.end_date else None,
                    "creator_name": creator.username if creator else "Unknown",
                    "user_joined": user_joined,
                })

            return result, 200

        except Exception as e:
            return {"error": str(e)}, 500


class ChallengesIndex(Resource):
    def patch(self, id):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        challenge = Challenge.query.get(id)
        if not challenge:
            return {"error": "Challenge not found"}, 404
        if challenge.user_id != user_id:
            return {"error": "You are not the creator of this challenge"}, 403

        data = request.get_json()

        try:
            challenge.title = data.get("title", challenge.title)
            challenge.description = data.get("description", challenge.description)

            if "start_date" in data:
                challenge.start_date = datetime.fromisoformat(data["start_date"]) if data["start_date"] else challenge.start_date
            if "end_date" in data:
                challenge.end_date = datetime.fromisoformat(data["end_date"]) if data["end_date"] else challenge.end_date

            db.session.commit()

            return {
                "id": challenge.id,
                "title": challenge.title,
                "description": challenge.description,
                "start_date": challenge.start_date.isoformat() if challenge.start_date else None,
                "end_date": challenge.end_date.isoformat() if challenge.end_date else None
            }, 200

        except Exception:
            db.session.rollback()
            return {"error": "Failed to update challenge."}, 500

    def delete(self, id):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        challenge = Challenge.query.get(id)
        if not challenge:
            return {"error": "Challenge not found"}, 404
        if challenge.user_id != user_id:
            return {"error": "You are not the creator of this challenge"}, 403

        db.session.delete(challenge)
        db.session.commit()
        return {"message": "Challenge successfully deleted."}, 204


class MyDayChallenges(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        try:
            participations = Participation.query.filter_by(user_id=user_id).all()
            result = []

            for p in participations:
                c = p.challenge
                creator = User.query.get(c.user_id)

                result.append({
                    "id": c.id,
                    "title": c.title,
                    "description": c.description,
                    "participation_id": p.id,
                    "start_date": c.start_date.isoformat() if c.start_date else None,
                    "end_date": c.end_date.isoformat() if c.end_date else None,
                    "creator_name": creator.username if creator else "Unknown",
                    "join_date": p.join_date.isoformat() if p.join_date else None,
                })

            return result, 200

        except Exception as e:
            return {"error": str(e)}, 500


class UserCreatedChallenges(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        try:
            challenges = Challenge.query.filter_by(user_id=user_id).all()
            result = []

            for c in challenges:
                participant_count = Participation.query.filter_by(challenge_id=c.id).count()

                result.append({
                    "id": c.id,
                    "title": c.title,
                    "description": c.description,
                    "start_date": c.start_date.isoformat() if c.start_date else None,
                    "end_date": c.end_date.isoformat() if c.end_date else None,
                    "participant_count": participant_count,
                })

            return result, 200

        except Exception as e:
            return {"error": str(e)}, 500
