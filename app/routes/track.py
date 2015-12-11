from flask import Blueprint, render_template,request, redirect, url_for, jsonify
from flask.ext.login import login_required, current_user
from app.models.tracks import Track,Layer
from bson.objectid import ObjectId
import os, datetime
from app import db
from mongoengine import Q


track = Blueprint('track', __name__, url_prefix='/track')

@track.route('/', methods = ["GET","POST"])
def all_tracks():
	tracks = Track.objects()
	return render_template("all.html", tracks = tracks, search = "")


#FIND BETTER WAY TO QUERY
@track.route('/search', methods = ["GET","POST"])
def search():
	if request.method == "POST":
		search = request.form["search"]
		tracks = Track.objects(Q(trackName = search) | Q(originalArtist = search) | Q(createdBy = search))
	return render_template("all.html", tracks = tracks, search = search)


@track.route('/<trackID>')  
def track_page(trackID):
    track = Track.objects().get(id = ObjectId(trackID))
    return render_template('track.html',track = track)



@track.route('/save/<trackID>', methods = ["GET","POST"])
@login_required
def save_layer(trackID):
	if request.method == "POST":
		track = Track.objects().get(id = ObjectId(trackID))

		layerName = request.form['layerName']
		startTime = request.form['startTime']
		layerFile = request.files['layerFile']

		layerId = ObjectId()
		layerPath = filePath(track,layerId,layerName,startTime)
		layerFile.save('app'+layerPath)

		newLayer = Layer(
				layerName = layerName,
				layerPath = layerPath,
				createdBy = current_user.username,
				startTime = startTime,
				layerID = layerId )

		track.layers.append(newLayer)
		track.save()
	
	return jsonify(url = url_for('track.track_page', trackID=track.id))


@track.route('/delete/<trackID>/<layerID>')
@login_required
def del_layer(trackID,layerID):
	track = Track.objects().get(id = ObjectId(trackID))	
	if current_user.username == track.createdBy:
		track.update(pull__layers__layerID=ObjectId(layerID))
		track.save()

		if len(track.layers)-1 == 0: #why is -1 necessary?
			track.delete()
			return redirect( url_for('track.all_tracks') )
	return redirect( url_for('track.track_page', trackID=trackID))


@track.route('deletetrack/<trackID>')
@login_required
def del_track(trackID):
	track = Track.objects().get(id = ObjectId(trackID))	
	if current_user.username == track.createdBy:
		track.delete()
	return redirect( url_for('track.all_tracks') )



@track.route('/new', methods = ["POST","GET"])
@login_required
def new_track():
	if request.method == "POST":
		
		trackName = request.form['trackName']
		startTime = request.form['startTime']
		isHidden = request.form['isHidden']
		layerFile = request.files['layerFile']
	

		track = Track(
			trackName = trackName,
			createdBy = current_user.username, 
			originalArtist = request.form['originalArtist'],
			hidden = bool(int(isHidden)),
			)
		track.save()


		layerName =  trackName + " Original"

		layerId = ObjectId()
		layerPath = filePath(track,layerId,layerName,startTime)
		layerFile.save('app'+layerPath)

		newLayer = Layer(
				layerName = layerName,
				layerPath = layerPath,
				createdBy = current_user.username,
				startTime = startTime,
				layerID = layerId )

		track.layers.append(newLayer)
		track.save()




		return jsonify(url = url_for('track.track_page', trackID=track.id))
	return render_template('newTrack.html')


@track.route('/cleanup')
@login_required
def cleanup():
	filePath ='app/static/music/'
	if current_user.username != "itchynose27":
		return redirect( url_for('home.home_page') )

	else:
		fileNames = os.listdir(filePath)
		fileNames = [x for x in fileNames if x.endswith(".wav")]
		
		for filename in fileNames:
			layerId = filename.split("__")[0]
 			print layerId
			existingTrack = Track.objects(layers__layerID = ObjectId(layerId)).first()

			if existingTrack == None:
				os.remove(filePath+filename)



		return str(fileNames)



def filePath(track,layerId, layerName, startTime):
	pathName = "/static/music/"+str(layerId)+"__"+str(track.id)+"__"+layerName+"__"+startTime.replace(".","-")+".wav"
	return pathName.replace(" ","")
