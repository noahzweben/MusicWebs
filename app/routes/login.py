from flask import Blueprint, render_template
from oauth import OAuthSignIn

login = Blueprint('login', __name__)
