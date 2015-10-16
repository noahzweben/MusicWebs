from mongoengine import connect
from app.models.tracks import Track,Layer

connect('musicwebs')
Track.drop_collection()



newLayer = Layer(
			layerName = "Timshel Song",
			layerPath = "/static/music/timshel.m4a",
			createdBy = "Noah Zweben",
			startTime = 0)


newLayer2 = Layer(
			layerName = "Timshel Song",
			layerPath = "/static/music/timshel.m4a",
			createdBy = "Noah Zweben",
			startTime = 0)

newTrack = Track(
			trackName = "Timshel",
			createdBy = "Noah Zweben",
			)

newTrack.layers.append(newLayer)
newTrack.layers.append(newLayer2)


newTrack.save()
myid = newTrack.id
