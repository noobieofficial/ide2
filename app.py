import json
from func import *
from noobie02 import NoobieInterpreter
from flask import Flask, render_template, redirect, jsonify, url_for

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)