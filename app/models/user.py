from app import db
from flask.ext.login import UserMixin

class User(db.Document, UserMixin):
    social_id = db.StringField(required=True)
    username = db.StringField(required=True)
    email = db.StringField(required=True)

    def get_id(self):
       	return str(self.id)
