from . import *
from sqlalchemy_serializer import SerializerMixin

class ProgressLog(db.Model, SerializerMixin):
    __tablename__ = 'progresslogs'

    serialize_rules = ('-habit.progresslogs', '-challenge.progresslogs',)

    id = db.Column(db.Integer(), primary_key=True)
    habit_id = db.Column(db.Integer(), db.ForeignKey("habits.id", ondelete='CASCADE'), nullable=False)
    challenge_id = db.Column(db.Integer(), db.ForeignKey("challenges.id", ondelete='CASCADE'), nullable=True)
    date = db.Column(db.Date(), onupdate=db.func.now())
    time = db.Column(db.Time(), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    status = db.Column(db.Text, nullable=False, default='Completed✅')
    note = db.Column(db.Text)

    habit = db.relationship('Habit', back_populates="progresslogs")
    challenge = db.relationship('Challenge', back_populates="progresslogs")
    user = db.relationship('User', back_populates="progresslogs")

    def __repr__(self):
        return f'<Habit: {self.habit_id}, Challenge: {self.challenge_id}, Date: {self.date}, Status: {self.status}>'