import os
import secrets

from flask import Flask, url_for
from flask.ext.mongoengine import MongoEngine
from flask.ext.login import LoginManager
app = Flask(__name__)


app.config['DEBUG'] = True # Enable this only while testing!
app.config['MONGODB_SETTINGS'] = { 'db': 'musicwebs' }
app.config['OAUTH_CREDENTIALS'] = {
    'facebook': {
        'id': secrets.FACEBOOK_ACCESS_KEY_ID,
        'secret': secrets.FACEBOOK_SECRET_KEY
    }
}
app.config['SECRET_KEY'] = secrets.SECRET_KEY

db = MongoEngine(app)

# Associate Flask-Login manager with current app
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login.index"

@login_manager.user_loader
def load_user(user_id):
    from app.models.user import User
    return User.objects().get(id=user_id)


from app.routes.home import home
from app.routes.track import track
from app.routes.login import login
from app.routes.user import user
app.register_blueprint(home)
app.register_blueprint(track)
app.register_blueprint(login)
app.register_blueprint(user)
