from . import *

class Participation(db.Model):
    __tablename__ = 'participations'

    user_id = db.Column(db.Integer(), db.ForeignKey("users.id"))
    challenge_id = db.Column(db.Integer(), db.ForeignKey("challenges.id"))
    reason_for_joining = db.Column(db.String())
    personal_goal = db.Column(db.String())

    user = db.relationship('User', back_populates="participations")
    challenge = db.relationship('Challenge', back_populates="participations", cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User: {self.user_id}, Challenge: {self.challenge_id}, Reason for joining: {self.reason_for_joining}, Personal goal: {self.personal_goal}>'