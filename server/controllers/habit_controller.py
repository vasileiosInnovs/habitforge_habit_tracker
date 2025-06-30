from flask import jsonify, make_response, request, session
from flask_restful import Resource

from server.models import db, Habit
from server.app import api
from server.models import ProgressLog
import datetime

class HabitList(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id:
            habits = Habit.query.filter_by(user_id=user_id).all()

            if habits:
                
                habits_list = []
                for habit in habits:
                    habit_dict = {
                        "id": habit.id,
                        "name": habit.name,
                        "description": habit.description,
                        "frequency": habit.frequency,
                        "completed": habit.completed,
                        "user_id": habit.user_id
                    }
                    habits_list.append(habit_dict)

                return make_response(
                    jsonify(habits_list),
                    200
                )
            
            else:
                return make_response(jsonify({
                    "Message": "You don't have habits."
                }), 204)
            
        else:
            return make_response(
                jsonify({'error': 'Unauthorized'}),
                401
            )
        
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized. Please log in."}, 401

        data = request.get_json()

        name = data.get('name')
        description = data.get('description')
        frequency = data.get('frequency')
        completed = data.get('completed', False)

        errors = {}
        if not name:
            errors['name'] = 'Name the habit'
        if not description:
            errors['description'] = 'Describe the habit'
        if not frequency:
            errors['frequency'] = 'Please key in the frequency'

        if errors:
            return {'errors': errors}, 422

        try:
            new_habit = Habit(
                name=name,
                description=description,
                frequency=frequency,
                completed=completed,
                user_id=user_id
            )
            db.session.add(new_habit)
            db.session.commit()

            response = {
                'id': new_habit.id,
                'name': new_habit.name,
                'description': new_habit.description,
                'frequency': new_habit.frequency,
                "completed": new_habit.completed,
                'user_id': new_habit.user_id
            }

            return make_response(jsonify(response), 201)

        except Exception as e:
            db.session.rollback()
            print(f"[ERROR] Failed to create habit: {str(e)}")
            return jsonify({"error": f"Invalid data. Could not create habit. {str(e)}"}), 422


class HabitIndex(Resource):
    def get(self, id):
        if session.get('user_id'):
            habit = Habit.query.filter(Habit.id == id).first()

            if habit:
                habit_dict = {
                    "name": habit.name,
                    "description": habit.description,
                    "frequency": habit.frequency,
                    "completed": habit.completed

                }

                return make_response(
                    jsonify(habit_dict),
                    200
                )
            
            else:
                return make_response(jsonify({
                    "Message": "You don't have habits."
                }), 204)
            
        else:
            return make_response(
                jsonify({'error': 'Unauthorized'}),
                401
            )
        
    def patch(self, id):
        habit = Habit.query.get(id)

        if not habit:
            return jsonify({"error": "Habit not found"}), 404

        if habit.user_id != session.get('user_id'):
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json()

        if "name" in data:
            habit.name = data.get('name', habit.name)
        if "description" in data:
            habit.description = data.get('description', habit.description)
        if "frequency" in data:
            habit.frequency = data.get('frequency', habit.frequency)
        if "completed" in data:
            habit.completed = data.get("completed", habit.completed)

        try:
            db.session.commit()
            return jsonify({
                "id": habit.id,
                "name": habit.name,
                "description": habit.description,
                "frequency": habit.frequency,
                "completed": habit.completed,
                "user_id": habit.user_id
            }), 200

        except Exception as e:
            db.session.rollback()
            print(f"[ERROR] Failed to create habit: {str(e)}")  # 👈 log it
            return jsonify({"error": f"Failed to create habit: {str(e)}"}), 422



    def delete(self, id):
        if session.get('user_id'):

            habit = Habit.query.filter(Habit.id == id).first()

            if not habit:
                return jsonify({"error": "Habit not found"}), 404

            db.session.delete(habit)
            db.session.commit()

            return make_response(
                jsonify({'message':'Habit successfully deleted.'}),
                202
            )
        
        else:
            return make_response(
                jsonify({'error': 'Unauthorized'}),
                401
            )


