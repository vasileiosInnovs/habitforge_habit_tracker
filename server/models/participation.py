from . import db, metadata

participation = db.Table(
    'participation',
    db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey(
        'users.id'), primary_key=True),
    db.Column('challenge_id', db.Integer, db.ForeignKey(
        'challenges.id'), primary_key=True),
    db.Column('reason_for_joining', db.String),
    db.Column('personal_goal', db.String)
)