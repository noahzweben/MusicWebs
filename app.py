from flask import Flask, render_template, request
from flask.ext.pymongo import PyMongo
import gridfs
import pymongo 
app = Flask(__name__)

client = pymongo.MongoClient()
db = client.example
fs = gridfs.GridFS(db)


filePath = "static/music/timshel.m4a"
theFile = open(filePath,"r")
fileData = theFile.read()

stored = fs.put(fileData, filename="myTimshel.m4a")

app.config['DEBUG'] = True # Enable this only while testing!

@app.route('/')
def hello():
	mySong = fs.get(stored)
	outputdata =mySong.read()  # create an output file and store the image in the output file
	outfilename ="timshell"
	output= open(outfilename,"w")
	output.write(outputdata)
	output.close
	return render_template('index2.html', x = "poop")

@app.route("/cancel")
def goodbye():
	client.drop_database('example');
	print("\n\n\n\n\n"+str(client.database_names()))
	client.close()
	return("bye")

# If the user executed this python file (typed `python app.py` in their
# terminal), run our app.
if __name__ == '__main__':
	app.run(host='0.0.0.0')