from flask import jsonify, make_response, request, session
from flask_restful import Resource
from server.models import db, Habit


class HabitList(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            return make_response(jsonify({'error': 'Unauthorized'}), 401)

        habits = Habit.query.filter_by(user_id=user_id).all()
        habits_list = [habit.to_dict() for habit in habits]

        return make_response(jsonify(habits_list), 200)

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

            return make_response(jsonify(new_habit.to_dict()), 201)

        except Exception as e:
            db.session.rollback()
            print(f"[ERROR] Failed to create habit: {str(e)}")
            return jsonify({"error": f"Could not create habit. {str(e)}"}), 500


class HabitIndex(Resource):
    def get(self, id):
        user_id = session.get("user_id")
        if not user_id:
            return make_response(jsonify({'error': 'Unauthorized'}), 401)

        habit = Habit.query.get(id)
        if habit and habit.user_id == user_id:
            return make_response(jsonify(habit.to_dict()), 200)
        else:
            return make_response(jsonify({"error": "Habit not found"}), 404)


class HabitByID(Resource):
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