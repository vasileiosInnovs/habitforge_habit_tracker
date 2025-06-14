from . import *

class ProgressLog(db.Model):
    __tablename__ = 'progresslogs'

    id = db.Column(db.Integer(), primary_key=True)
    habit_id = db.Column(db.Integer(), db.ForeignKey("habits.id"))
    challenge_id = db.Column(db.Integer(), db.ForeignKey("challenges.id"))
    date = db.Column(db.DateTime(), onupdate=db.func.now())
    status = db.Column(db.String())
    note = db.Column(db.String())

    habit = db.relationship('Habit', back_populates="progresslogs")
    challenge = db.relationship('Challenge', back_populates="progresslogs")

    def __repr__(self):
        return f'<Habit: {self.habit_id}, Challenge: {self.challenge_id}, Date: {self.date}, Status: {self.status}>'