from . import *

class Challenge(db.Model):
    __tablename__ = 'challenges'

    id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String())
    description = db.Column(db.String())
    start_date = db.Column(db.DateTime(), server_default=db.func.now())
    end_date = db.Column(db.DateTime()) 

    participations = db.relationship('Participation', back_populates="challenge", cascade='all, delete-orphan')
    progresslogs = db.relationship('ProgressLog', back_populates="challenge", cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Challenge: {self.title}, {self.description}>'