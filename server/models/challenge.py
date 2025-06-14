from . import db

class Challenge(db.Model):
    __tablename__ = 'challenges'

    id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String())
    description = db.Column(db.String())
    start_date = db.Column(db.DateTime(), server_default=db.func.now())
    end_date = db.Column(db.DateTime()) 

    def __repr__(self):
        return f'<Challenge: {self.title}, {self.description}>'