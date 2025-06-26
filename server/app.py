import os

from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

from models import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)

from controllers.auth_controller import SignUp, Login, Logout, CheckSession
from controllers.habit_controller import HabitList, HabitIndex
from controllers.challenge_controller import ChallengeList, ChallengesIndex

api.add_resource(SignUp, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')

api.add_resource(HabitList, '/habits')
api.add_resource(HabitIndex, '/habits/<int:id>')

api.add_resource(ChallengeList, '/challenges')
api.add_resource(ChallengesIndex, '/challenges/<int:id>')