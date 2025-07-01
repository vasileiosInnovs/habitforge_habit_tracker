from . import *
from sqlalchemy_serializer import SerializerMixin

class Habit(db.Model, SerializerMixin):
    __tablename__ = 'habits'

    serialize_rules = ('-user.habits','-progresslogs.habit', '-progresslogs.user.habits', '-user.progresslogs',)

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(), nullable=True)
    description = db.Column(db.String(255))
    frequency = db.Column(db.String(), nullable=False)
    completed = db.Column(db.Boolean,nullable=False, default=False)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id', ondelete='CASCADE'))

    user = db.relationship('User', back_populates="habits")
    progresslogs = db.relationship('ProgressLog', back_populates="habit", cascade='all, delete-orphan')

    def __repr__(self):
        return f'<{self.id}, {self.name}, {self.description}, {self.frequency}>'