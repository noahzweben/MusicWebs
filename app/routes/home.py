from flask import Blueprint, render_template
from app.models.tracks import Track,Layer
from bson.objectid import ObjectId
from reset_db import myid


home = Blueprint('home', __name__)


@home.route('/')
def home_page():
    """The home page."""
    tracks = Track.objects()
    return render_template('all.html', tracks = tracks)

# @home.route('/<trackID>')
# def track_page(trackID):
#     track = Track.objects().get(id = ObjectId(myid))
#     return render_template('track.html',track = track)