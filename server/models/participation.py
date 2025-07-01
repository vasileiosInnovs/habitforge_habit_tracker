from . import *
from sqlalchemy_serializer import SerializerMixin

class Participation(db.Model, SerializerMixin):
    __tablename__ = 'participations'

    serialize_rules = ('-user.participation', '-challenge.participation',)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey("users.id", ondelete='CASCADE'))
    challenge_id = db.Column(db.Integer(), db.ForeignKey("challenges.id"))
    join_date = db.Column(db.DateTime, nullable=False)

    user = db.relationship('User', back_populates="participations")
    challenge = db.relationship('Challenge', back_populates="participations")

    def __repr__(self):
        return f'<User: {self.user_id}, Challenge: {self.challenge_id}>'