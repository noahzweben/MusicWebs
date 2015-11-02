import os
from flask import Flask
from flask.ext.mongoengine import MongoEngine
from flask.ext.login import LoginManager

app = Flask(__name__)


app.config['DEBUG'] = True # Enable this only while testing!
app.config['MONGODB_SETTINGS'] = { 'db': 'musicwebs' }

db = MongoEngine(app)


# Associate Flask-Login manager with current app
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.objects().get(username = user_id)



from app.routes.home import home
from app.routes.track import track
app.register_blueprint(home)
app.register_blueprint(track)

