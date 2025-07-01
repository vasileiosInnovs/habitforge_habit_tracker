from flask import jsonify, make_response, request, session
from flask_restful import Resource
from server.models import db, Habit
import traceback

class HabitList(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            return make_response(jsonify({'error': 'Unauthorized'}), 401)

        habits = Habit.query.filter_by(user_id=user_id).all()
        habits_list = [habit.to_dict() for habit in habits]

        return habits_list, 200

    def post(self):
        data = request.get_json()

        try:
            name = data.get("name")
            frequency = data.get("frequency")
            description = data.get("description")
            user_id = session.get("user_id")

            if not user_id:
                return {"message": "Unauthorized"}, 401

            habit = Habit(
                name=name,
                frequency=frequency,
                description=description,
                user_id=user_id
            )

            db.session.add(habit)
            db.session.commit()

            habit_dict = {
                'id': habit.id,
                'name': habit.name,
                'frequency': habit.frequency,
                'description': habit.description,
                'user_id': habit.user_id
            }
            
            return habit_dict, 20

        except Exception as e:
            db.session.rollback()
            print("[ERROR] Failed to create habit:", traceback.format_exc())
            return {"message": "Internal Server Error"}, 500


class HabitByID(Resource):
    def get(self, id):
        user_id = session.get("user_id")
        if not user_id:
            return make_response(jsonify({'error': 'Unauthorized'}), 401)

        habit = Habit.query.get(id)
        if habit and habit.user_id == user_id:
            return habit.to_dict(), 200
        else:
            return make_response(jsonify({"error": "Habit not found"}), 404)
        
    def patch(self, id):
        habit = Habit.query.get(id)
        if not habit:
            return {"error": "Habit not found"}, 404

        data = request.get_json()
        print(f"Updating habit {id} with data: {data}")

        try:
            for attr in ["name", "frequency", "description", "completed"]:
                if attr in data:
                    setattr(habit, attr, data[attr])

            db.session.commit()
            return habit.to_dict(), 200

        except Exception as e:
            db.session.rollback()
            import traceback
            traceback.print_exc()
            return {"error": "Failed to update habit"}, 500

    def delete(self, id):
        habit = Habit.query.get(id)
        if not habit:
            return {"error": "Habit not found"}, 404

        try:
            db.session.delete(habit)
            db.session.commit()
            return {"message": "Habit deleted"}, 200
        except Exception as e:
            db.session.rollback()
            print("DELETE /habits/<id> error:", e)
            return {"error": "Failed to delete habit"}, 500