import os, json
# from models import *
import datetime

from flask import Flask, session, render_template, request, redirect, jsonify
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))
SESSION = db()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/add", methods = ['POST'])
def add_task():
    task = request.get_json('task')
    with open('tasks.json', 'a+') as file:
        file.seek(0)
        data = file.read()
        if len(data) > 0:
            file.write("\n")
            json.dump(task, file)
        else:
            json.dump(task, file)
    return jsonify({"success" : 200})

@app.route("/api/getTask", methods = ["GET","POST"])
def show_tasks():
    all_taks = []
    with open('tasks.json', 'r') as file:
        for jsonObj in file.readlines():
            all_taks.append(json.loads(jsonObj))
    return jsonify({"success" : 200, "taskList" : all_taks})  






  




          
