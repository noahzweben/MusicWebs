from flask import Blueprint, render_template
from app.models.tracks import Track
from bson.objectid import ObjectId
from reset_db import myid
track = Blueprint('track', __name__, url_prefix='/track')


@track.route('/<trackID>')  
def track_page(trackID):
    track = Track.objects().get(id = ObjectId(trackID))
    print myid
    return render_template('track.html',track = track)