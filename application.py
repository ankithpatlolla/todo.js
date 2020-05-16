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
        print(data)
        if not data.strip():
            if len(data) > 0:
                file.write("\n")
                json.dump(task, file)
        else:
            json.dump(task, file)
    return jsonify({"status" : 200})

@app.route("/api/getTask", methods = ["GET","POST"])
def show_tasks():
    all_taks = []
    with open('tasks.json', 'r') as file:
        for obj in file.readlines():
            # print(obj, "obj#####")
            all_taks.append(json.loads(obj))
    return jsonify({"status" : 200, "taskList" : all_taks})


@app.route("/api/mark", methods = ["POST"])
def markTask():
    id = request.form.get('id')
    print(id, type(id))
    all_taks = []
    with open('tasks.json', 'r') as file:
        for obj in file.readlines():
            if not obj.strip():
                continue
            else: 
                taskObj = json.loads(obj)
                if taskObj['taskId'] != int(id):
                    all_taks.append(obj)
                else :
                    taskObj['isDone'] = True
                    obj = json.dumps(taskObj)
                    all_taks.append(obj + "\n")
    with open('tasks.json', 'w') as file:
        file.writelines(''.join(all_taks))
    return jsonify({"status" : 200})   

@app.route("/api/delete", methods = ["POST"])
def deleteTask():
    id = request.form.get('id')
    all_taks = []
    with open('tasks.json', 'r') as file:
        for obj in file.readlines():
            if not obj.strip():
                continue
            else :
                taskObj = json.loads(obj)
                if taskObj['taskId'] != int(id):
                    all_taks.append(obj)
    print(all_taks)                
    with open('tasks.json', 'w') as file:
        file.writelines(''.join(all_taks))
    return jsonify({"status" : 200})







  




          
