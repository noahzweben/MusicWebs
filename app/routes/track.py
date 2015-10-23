from flask import Blueprint, render_template,request, redirect, url_for
from app.models.tracks import Track,Layer
from bson.objectid import ObjectId
import os, datetime

track = Blueprint('track', __name__, url_prefix='/track')


@track.route('/<trackID>')  
def track_page(trackID):
    track = Track.objects().get(id = ObjectId(trackID))
    return render_template('track.html',track = track)



@track.route('/save/<trackID>', methods = ["POST"])
def save_layer(trackID):
	print request.form
	print request.files

	track = Track.objects().get(id = ObjectId(trackID))

	layerName = request.form['layerName']
	startTime = request.form['startTime']
	layerFile = request.files['layerFile']

	layerPath = "/static/music/wedidit.wav"

	newLayer = Layer(
			layerName = layerName,
			layerPath = layerPath,
			createdBy = "Noah Zweben",
			startTime = startTime)

	layerFile.save('app/'+layerPath)
	track.layers.append(newLayer)
	track.save()

	return redirect( url_for('track.track_page', trackID=trackID))
