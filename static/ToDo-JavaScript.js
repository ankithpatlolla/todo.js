let taskList = []

class Task {

    constructor(taskId, name, dueDate, isDone) {
        this.taskId = taskId;
        this.name = name;
        this.dueDate = dueDate;
        this.isDone = isDone;
    }

    toString() {
        let htmlText = '<li class="task" ><div>'
        htmlText += this.name;
        htmlText += ", " + this.dueDate;
        htmlText += '<input type="checkbox" name="isDone" id="isDone" onclick="marked('+this.taskId+')">'
        htmlText += '<button onclick="deleteTask(';
        htmlText += this.taskId;
        htmlText += ')">Delete</button>';
        htmlText += '</div></li>';
        return htmlText;
    }
}

function render() {
    const listUI = document.getElementById("todolist")
    listUI.innerHTML = "";
    if (taskList.length === 0) listUI.innerHTML = "No tasks todo :-)"
    taskList.forEach((task) => {
        console.log(task)
        if (task.isDone === true) {
            listUI.innerHTML += "<b>" + task.toString() + "</b>";
        } else {
            listUI.innerHTML += task.toString();
        }
    })
}

function deleteTask(taskId) {
    taskList = taskList.filter(
        (t) => {
            if(t.taskId != taskId) 
            return t;
        }
    );
    render();
    // call a web api to update the database on the server
    const myReq = new XMLHttpRequest();
    myReq.open('POST', '/api/delete');
    myReq.onload = () => { 
    const data = JSON.parse(myReq.responseText);
    }
    const data = new FormData();
    data.append('id', taskId);
    myReq.send(data);
    return false;
    // update the DOM
}

function createTask() {
    const taskName = document.getElementById("taskName").value;
    const dueDate = document.getElementById("dueDate").value;
    if(dueDate.length == 0 || taskName.length == 0){
        alert("Task name and Due date are mandatory")
        return false;   
    }
    addTask(new Task(Date.now(), taskName, dueDate, false));
}

function addTask(t) {
    taskList.push(t)
    render();
    taskObj = {'taskId':t.taskId,
            'name':t.name,
            'dueDate':t.dueDate,
            'isDone':t.isDone}
    const myReq = new XMLHttpRequest();
    myReq.open('POST', '/api/add');
    myReq.onload = () => {
        const data = JSON.parse(myReq.responseText);
    }   
    const data = JSON.stringify(taskObj);
    myReq.send(data);
    return false;     
}

function marked(taskId) {
    taskList.forEach((task) => {
        if (task.taskId === taskId) {
            task.isDone = true;
        }
    })
    console.log(taskList);
    const myReq = new XMLHttpRequest();
    myReq.open('POST', '/api/mark');
    myReq.onload = () => { 
    const data = JSON.parse(myReq.responseText);
    }
    const data = new FormData();
    data.append('id', taskId);
    myReq.send(data);
    return false;
}


function init() {
    console.log("init called");

    // call a web api to retrieve the task list
    // write a function to send a api request
    // get the JSON
    // assign it to taskList
    // render
    const myReq = new XMLHttpRequest();
    myReq.open('POST', '/api/getTask');
    myReq.onload = () => { 
    const data = JSON.parse(myReq.responseText);
    for (let i = 0; i < data.taskList.length; i++) {
        taskList.push(new Task(data.taskList[i].taskId, data.taskList[i].name, data.taskList[i].dueDate, data.taskList[i].isDone))
    }
    render();
    console.log(taskList);
    }
    myReq.send()
    return false
}

init();