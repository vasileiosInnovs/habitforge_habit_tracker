from . import *

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String())
    email = db.Column(db.String())
    password = db.Column(db.String())

    habits = db.relationship('Habit', back_populates='user', cascade='all, delete-orphan')
    participations = db.relationship('Participation', back_populates='user', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Id: {self.id}, Username: {self.username}, Email: {self.email}, Password: {self.password}>'