from app import app
from flask_bcrypt import Bcrypt

app.secret_key = b'Y\xf1Xz\x00\xad|eQ\x80t \xca\x1a\x10K'

bcrypt = Bcrypt(app)
