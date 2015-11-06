import app
from flask import Blueprint, redirect, url_for, render_template
from flask.ext.login import LoginManager, UserMixin, login_user, logout_user, current_user
from app.models.oauth import OAuthSignIn
from app import db
from app.models.user import User

login = Blueprint('login', __name__, url_prefix='/login')


@login.route('/')
def index():
    return render_template('login.html')


@login.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))

@login.route('/authorize/<provider>')
def oauth_authorize(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('login'))
    oauth = OAuthSignIn.get_provider(provider)
    return oauth.authorize()


@login.route('/callback/<provider>')
def oauth_callback(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('login'))
    oauth = OAuthSignIn.get_provider(provider)
    social_id, username, email = oauth.callback()
    if social_id is None:
        flash('Authentication failed.')
        return redirect(url_for('login'))
    print social_id
    print username
    print email
    user = User.objects().get(social_id = db.StringField(social_id))
    if not user:
        user = User(social_id=social_id, username=username, email=email)
        user.save()
    login_user(user, True)
    return redirect(url_for('login'))


if __name__ == '__main__':
    print "Compiles successfully!"
