from app import db


class Layer(db.EmbeddedDocument):
    layerName = db.StringField(required = True, max_length=100)
    layerPath = db.StringField(required = True)
    createdBy = db.StringField(required = True)
    startTime = db.DecimalField(required = True)
    layerID = db.ObjectIdField()

class Track(db.Document):
    trackName = db.StringField(required=True, max_length=100) 
    originalArtist = db.StringField(required = True, max_length = 100)
    createdBy = db.StringField(required = True)
    layers = db.ListField(db.EmbeddedDocumentField('Layer'))
    hidden = db.BooleanField(default = False)
