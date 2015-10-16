from flask import Flask
from flask.ext.mongoengine import MongoEngine

app = Flask(__name__)


app.config['DEBUG'] = True # Enable this only while testing!
app.config['MONGODB_SETTINGS'] = { 'db': 'musicwebs' }

db = MongoEngine(app)

from app.routes.home import home
from app.routes.track import track
app.register_blueprint(home)
app.register_blueprint(track)




