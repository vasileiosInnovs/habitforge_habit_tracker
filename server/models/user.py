from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates

from . import *

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-habits.user', '-participation.user',)

    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.Text(), nullable=False)
    email = db.Column(db.String(), nullable=False, unique=True)
    _password = db.Column(db.String(), nullable=False)
    image_url = db.Column(db.String)
    bio = db.Column(db.String(100))

    habits = db.relationship('Habit', back_populates='user', cascade='all, delete-orphan')
    participations = db.relationship('Participation', back_populates='user', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Id: {self.id}, Username: {self.username}, Email: {self.email}>'
    
    @hybrid_property
    def password(self):
        raise AttributeError("Access has been denied!")
    
    @password.setter
    def password(self, plain_text):
        from server.config import bcrypt
        self._password = bcrypt.generate_password_hash(plain_text)

    def check_pass(self, password):
        from server.config import bcrypt
        return bcrypt.check_password_hash(self._password, password)
    
    @validates('email')
    def validate_email(self, key, address):
        if '@' not in address:
            raise ValueError("Failed simple email validation")
        return address
    