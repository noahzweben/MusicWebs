from app import db


class User(db.Document):
    id = db.ObjectIdField()
    social_id = db.StringField(required=True)
    username = db.StringField(required=True)
    email = db.StringField(required=True)
