import datetime
from flask import  request, session
from flask_restful import Resource

from server.models import ProgressLog, db
from server.app import api

class ProgressLogList(Resource):
    def get(self):
        user_id = session.get("user_id")

        if user_id:

            habit_id = request.args.get("habit_id")
            challenge_id = request.args.get("challenge_id")

            logs = ProgressLog.query.filter(ProgressLog.user_id == user_id).all()  
            if habit_id:
                query = query.filter_by(habit_id=habit_id)
            if challenge_id:
                query = query.filter_by(challenge_id=challenge_id)

            logs = ProgressLog.query.filter_by(user_id=session["user_id"], challenge_id=challenge_id).order_by(ProgressLog.date).all()


            if logs:                
                logs_list = []
                for log in logs:
                    log_dict = {
                        "id": log.id,
                        "date": log.date,
                        "time": log.time,
                        "habit_id": log.habit_id,
                        "challenge_id": log.challenge_id,
                        "name": log.habit.name if log.habit else None
                    }
                    logs_list.append(log_dict)

                return logs_list, 200
            
            else:
                return {
                    "Message": "There are no logs"
                }, 200
            
        else:
            return {'error': 'Unauthorized'}, 401
        

    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {'error': 'Unauthorized'}, 401
        
        data = request.get_json()
        challenge_id = data.get("challenge_id")

        if not challenge_id:
            return {'error': 'Challenge ID is required'}, 400

        try:
            new_log = ProgressLog(
                user_id=user_id,
                habit_id=data.get("habit_id"),
                challenge_id=data.get("challenge_id"),
                date=datetime.datetime.strptime(data.get("date"), "%Y-%m-%d").date() if data.get("date") else datetime.datetime.now().date(),
                time=datetime.datetime.strptime(data.get("time"), "%H:%M:%S").time() if data.get("time") else datetime.datetime.now().time()
            )
            
            db.session.add(new_log)
            db.session.commit()

            return {"message": "Log created", "id": new_log.id}, 201
        
        except Exception as e:
            return {"error": str(e)}, 400

class Log(Resource):
    def patch(self, id):
        user_id = session.get("user_id")
        if not user_id:
            return {'error': 'Unauthorized'}, 401
        
        log = ProgressLog.query.get(id)
        if not log or log.user_id != user_id:
            return {
                'error': 'Log not found or authorized'
            }, 404
        
        data = request.get_json()

        try:
            db.session.commit()
            return {
                'message': 'Log updated successfully'
            }, 200
        except Exception:
            db.session.rollback()
            return {
                'error': 'Failed to update log'
            }, 500
        
    def delete(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {
                'error': 'Unauthorized'
            }, 401
        
        log = ProgressLog.query.get(id)
        if not log or log.user_id != user_id:
            return {
                'error': 'Log not found or unauthorized'
            }, 404
        
        try:
            db.session.delete(log)
            db.session.commit()
            return {
                'message': 'Log deleted'
            }, 204
        except Exception:
            db.session.rollback()
            return {
                'error': 'Failed to delete log'
            }, 500
