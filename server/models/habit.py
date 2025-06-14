from . import *

class Habit(db.Model):
    __tablename__ = 'habits'

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String())
    description = db.Column(db.String())
    frequency = db.Column(db.String())
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates="habits")
    progresslogs = db.relationship('ProgressLog', back_populates="habit", cascade='all, delete-orphan')

    def __repr__(self):
        return f'<{self.id}, {self.name}, {self.description}, {self.frequency}>'