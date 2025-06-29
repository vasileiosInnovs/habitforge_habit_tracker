import os

from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt

from server.models import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.environ.get('THE_SECRET_KEY')
app.json.compact = False

app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

migrate = Migrate(app, db)
db.init_app(app)
bcrypt = Bcrypt(app)

CORS(app, supports_credentials=True, origins=["https://habitforge.onrender.com"])
api = Api(app)

from server.controllers.auth_controller import SignUp, Login, Logout, CheckSession
from server.controllers.habit_controller import HabitList, HabitIndex
from server.controllers.challenge_controller import ChallengeList, ChallengesIndex
from server.controllers.progresslog_controller import ProgressLog, Log
from server.controllers.participation_controller import ParticipationList, ParticipationIndex
from server.controllers.user import Profile

api.add_resource(SignUp, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')

api.add_resource(HabitList, '/habits')
api.add_resource(HabitIndex, '/habits/<int:id>')

api.add_resource(ChallengeList, '/challenges')
api.add_resource(ChallengesIndex, '/challenges/<int:id>')

api.add_resource(ProgressLog, '/logs')
api.add_resource(Log, '/log/<int:id>')

api.add_resource(ParticipationList, '/participation')
api.add_resource(ParticipationIndex, '/participation/<int:id>')

api.add_resource(Profile, '/profile')