from flask import Blueprint, render_template,request, redirect, url_for, jsonify
from flask.ext.login import login_required, current_user
from app.models.tracks import Track,Layer
from bson.objectid import ObjectId
import os, datetime
from app import db


track = Blueprint('track', __name__, url_prefix='/track')

@track.route('/')
def all_tracks():
	tracks = Track.objects()
	return render_template("all.html", tracks = tracks)

@track.route('/<trackID>')  
def track_page(trackID):
    track = Track.objects().get(id = ObjectId(trackID))
    return render_template('track.html',track = track)



@track.route('/save/<trackID>', methods = ["GET","POST"])
def save_layer(trackID):
	if request.method == "POST":
		track = Track.objects().get(id = ObjectId(trackID))

		layerName = request.form['layerName']
		startTime = request.form['startTime']
		layerFile = request.files['layerFile']
		layerPath = filePath(track,startTime)

		newLayer = Layer(
				layerName = layerName,
				layerPath = layerPath,
				createdBy = current_user.username,
				startTime = startTime,
				layerID = ObjectId() )

		layerFile.save('app/'+layerPath)
		track.layers.append(newLayer)
		track.save()

	return jsonify(url = url_for('track.track_page', trackID=track.id))


@track.route('/delete/<trackID>/<layerID>')
def del_layer(trackID,layerID):
	track = Track.objects().get(id = ObjectId(trackID))	
	track.update(pull__layers__layerID=ObjectId(layerID))
	track.save()

	if len(track.layers)-1 == 0: #why is -1 necessary?
		print "Deleting Track"
		track.delete()
		return redirect( url_for('home.home_page') )
	return redirect( url_for('track.track_page', trackID=trackID))


@track.route('/new', methods = ["POST","GET"])
@login_required
def new_track():
	if request.method == "POST":
		
		trackName = request.form['trackName']
		startTime = request.form['startTime']
		layerFile = request.files['layerFile']
		


		track = Track(
			trackName = trackName,
			createdBy = current_user.username, 
			)

		layerName =  trackName + " Original"
		layerPath = filePath(track,startTime)

		newLayer = Layer(
				layerName = layerName,
				layerPath = layerPath,
				createdBy = current_user.username,
				startTime = startTime,
				layerID = ObjectId() )

		layerFile.save('app'+layerPath)
		track.layers.append(newLayer)
		track.save()
		#return redirect( url_for('track.track_page', trackID=track.id))
		return jsonify(url = url_for('track.track_page', trackID=track.id))
	return render_template('newTrack.html')


# @track.route('/fork/<layerID>', methods=["POST"])
# def fork(layerID):
# 	if request.method=="POST":
# 		track = Track(
# 			trackName = request.form['trackName'],
# 			createdBy = "Noah Zweben",)

# 		layer = Layer.objects.get(layerId = ObjectId(layerID))

def filePath(track,startTime):
	print startTime
	return "/static/music/"+datetime.datetime.now().strftime("%Y_%m_%d_%H_%M_%S_%f")+"__"+str(track.id)+"__"+startTime.replace(".","-")+".wav"



