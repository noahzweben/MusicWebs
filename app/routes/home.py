from flask import Blueprint, render_template
from app.models.tracks import Track,Layer
from bson.objectid import ObjectId


home = Blueprint('home', __name__)


@home.route('/')
def home_page():
    """The home page."""

    # 11/6: Commenting out for now because things are breaking
    #tracks = Track.objects()
    return render_template('index.html')#, tracks = tracks)

@home.route('/howto')
def howto_page():
	return render_template('howto.html')