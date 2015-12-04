from mongoengine import connect
from app.models.tracks import Track,Layer
from bson.objectid import ObjectId


connect('musicwebs')
Track.drop_collection()



newLayer = Layer(
			layerName = "Timshel Song",
			layerPath = "/static/music/timshel.m4a",
			createdBy = "Noah Zweben",
			layerID = ObjectId(),
			startTime = 0)


newLayer2 = Layer(
			layerName = "Timshel Song",
			layerPath = "/static/music/timshel.m4a",
			createdBy = "Noah Zweben",
			layerID = ObjectId(),
			startTime = 0)

newTrack = Track(
			trackName = "Timshel",
			originalArtist = "Mumford and Sons",
			createdBy = "Noah Zweben",
			)

newTrack.layers.append(newLayer)
newTrack.layers.append(newLayer2)


newTrack.save()
