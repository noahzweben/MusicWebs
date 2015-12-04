from flask import Blueprint, render_template,request, redirect, url_for, jsonify
from flask.ext.login import login_required, current_user
from app.models.tracks import Track,Layer
from app import db


user = Blueprint('user', __name__, url_prefix='/user')

@user.route('/<username>')
def findUser(username): #better way to query?
	tracks = Track.objects(createdBy = username)
	return render_template("all.html", tracks = tracks, search = username)
