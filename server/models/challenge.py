from . import *
from sqlalchemy_serializer import SerializerMixin

class Challenge(db.Model, SerializerMixin):
    __tablename__ = 'challenges'

    serialize_rules = ('-participation.challenge', '-progresslogs.challenge',)

    id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(), nullable=False)
    description = db.Column(db.String())
    start_date = db.Column(db.DateTime(), server_default=db.func.now())
    end_date = db.Column(db.DateTime()) 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=True)

    participations = db.relationship('Participation', back_populates="challenge", cascade='all, delete-orphan')
    progresslogs = db.relationship('ProgressLog', back_populates="challenge", cascade='all, delete-orphan')
    user = db.relationship('User', back_populates="challenges")

    def __repr__(self):
        return f'<Challenge: {self.title}, {self.description}>'