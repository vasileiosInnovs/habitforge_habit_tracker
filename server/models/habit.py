from . import db

class Habit(db.Model):
    __tablename__ = 'habits'

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String())
    description = db.Column(db.String())
    frequency = db.Column(db.String())
    user_id = db.Column(db.Integer())