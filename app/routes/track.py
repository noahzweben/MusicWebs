from flask import Blueprint, render_template
from app.models.tracks import Track
from bson.objectid import ObjectId

track = Blueprint('track', __name__, url_prefix='/track')

@track.route('/<trackID>')  # Accessible at /blog/
def track_page():
    track = Track.objects().get(id = ObjectId(trackID))
    return render_template('track.html',track = track)