from flask import Flask, render_template, request
app = Flask(__name__)

app.config['DEBUG'] = True # Enable this only while testing!

@app.route('/')
def hello():
	return render_template('index.html')


# If the user executed this python file (typed `python app.py` in their
# terminal), run our app.
if __name__ == '__main__':
	app.run(host='0.0.0.0')