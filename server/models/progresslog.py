from . import *
from sqlalchemy_serializer import SerializerMixin

class ProgressLog(db.Model, SerializerMixin):
    __tablename__ = 'progresslogs'

    serialize_rules = ('-habit.progresslog', '-challenge.progresslog',)

    id = db.Column(db.Integer(), primary_key=True)
    habit_id = db.Column(db.Integer(), db.ForeignKey("habits.id"), nullable=False)
    challenge_id = db.Column(db.Integer(), db.ForeignKey("challenges.id"), nullable=True)
    date = db.Column(db.DateTime(), onupdate=db.func.now())
    status = db.Column(db.Text, nullable=False, default='Completed✅')
    note = db.Column(db.Text)

    habit = db.relationship('Habit', back_populates="progresslogs")
    challenge = db.relationship('Challenge', back_populates="progresslogs")

    def __repr__(self):
        return f'<Habit: {self.habit_id}, Challenge: {self.challenge_id}, Date: {self.date}, Status: {self.status}>'