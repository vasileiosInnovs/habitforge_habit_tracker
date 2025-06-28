import datetime
from flask import jsonify, make_response, request, session
from flask_restful import Resource

from server.models import ProgressLog, db
from server.app import api

class ProgressLog(Resource):
    def get(self):
        user_id = session.get("user_id")

        if user_id:

            habit_id = request.args.get("habit_id")
            challenge_id = request.args.get("challenge_id")

            query = ProgressLog.query.filter_by(user_id=user_id)
            if habit_id:
                query = query.filter_by(habit_id=habit_id)
            if challenge_id:
                query = query.filter_by(challenge_id=challenge_id)

            logs = query.all()

            if logs:                
                logs_list = []
                for log in logs:
                    log_dict = {
                        "id": log.id,
                        "date": log.date,
                        "time": log.time,
                        "status": log.status,
                        "note": log.note,
                        "habit_id": log.habit_id,
                        "challenge_id": log.challenge_id
                    }
                    logs_list.append(log_dict)

                return make_response(
                    jsonify(logs_list),
                    200
                )
            
            else:
                return make_response(jsonify({
                    "Message": "There are no logs"
                }), 204)
            
        else:
            return make_response(
                jsonify({'error': 'Unauthorized'}),
                401
            )
        

    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({'error': 'Unauthorized'}), 401
        
        data = request.get_json()

        try:
            new_log = ProgressLog(
                user_id=user_id,
                habit_id=data.get("habit_id"),
                challenge_id=data.get("challenge_id"),
                date=datetime.datetime.strptime(data.get("date"), "%Y-%m-%d").date() if data.get("date") else datetime.datetime.now().date(),
                time=datetime.datetime.strptime(data.get("time"), "%H:%M:%S").time() if data.get("time") else datetime.datetime.now().time(),
                status=data.get("status"),
                note=data.get("note")
            )
            
            db.session.add(new_log)
            db.session.commit()

            return jsonify({"message": "Log created", "id": new_log.id}), 201
        
        except Exception as e:
            return jsonify({"error": str(e)}), 400

class Log(Resource):
    def patch(self, id):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({'error': 'Unauthorized'}), 401
        
        log = ProgressLog.query.get(id)
        if not log or log.user_id != user_id:
            return jsonify({
                'error': 'Log not found or authorized'
            }), 404
        
        data = request.get_json()

        log.status = data.get('status', log.status)
        log.note = data.get('note', log.note)
        log.rating = data.get('rating', log.rating)

        try:
            db.session.commit()
            return jsonify({
                'message': 'Log updated successfully'
            }), 200
        except:
            db.session.rollback()
            return jsonify({
                'error': 'Failed to update log'
            }), 500
        
    def delete(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({
                'error': 'Unauthorized'
            }), 401
        
        log = ProgressLog.query.get(id)
        if not log or log.user_id != user_id:
            return jsonify({
                'error': 'Log not found or unauthorized'
            }), 404
        
        try:
            db.session.delete(log)
            db.session.commit()
            return jsonify({
                'message': 'Log deleted'
            }), 204
        except:
            db.session.rollback()
            return jsonify({
                'error': 'Failed to delete log'
            }), 500
