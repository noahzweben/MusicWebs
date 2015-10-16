from flask import Blueprint, render_template
from app.models.tracks import Track,Layer

home = Blueprint('home', __name__)


@home.route('/')
def home_page():
    """The home page."""
    tracks = Track.objects()
    return render_template('index2.html', tracks = tracks)
