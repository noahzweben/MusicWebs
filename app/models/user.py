from app import db


class User(db.Document):
    id = db.StringField(required=True)
    social_id = db.StringField(required=True, unique=True)
    first_name = db.StringField(required=True)
    last_name = db.StringField(required=True)
    email = db.StringField(required=True)
