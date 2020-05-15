let taskList = []

class Task {
    constructor(name, dueDate, isDone) {
        this.taskId = Date.now();
        this.name = name;
        this.dueDate = new Date(dueDate);
        this.isDone = isDone;
    }

    toString() {
        let htmlText = '<li class="task" ><div>'
        htmlText += this.name
        htmlText += ", " + this.dueDate.getDate() + "/" + (this.dueDate.getMonth() + 1);
        htmlText += '<input type="checkbox" name="isDone" id="isDone">'
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
    if (taskList.length === 0) listUI.innerHTML = "No tasks :-)"
    taskList.forEach((task) => {
        listUI.innerHTML += task.toString();
        if (task.isDone === true) {
            document.getElementById(task.name).innerHTML = '<s>'+task.name+'</s>'
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
    // call a web api to update the database on the server
    
    // update the DOM
    render()
    console.log(taskList);
}

function createTask() {
    const taskName = document.getElementById("taskName").value;
    const dueDate = document.getElementById("dueDate").value;
    if(dueDate.length == 0 || taskName.length == 0){
        alert("Task name and Due date are mandatory")
        return false;   
    }
    addTask(new Task(taskName, dueDate, false));
}

function addTask(t) {
    // taskList.push(t)
    //call a web api to update the database on the server
    // render();
    // console.log(taskList);
    render();
    taskObj = {'taskID':t.taskID,
            'name':t.name,
            'dueDate':t.dueDate,
            'isDone':t.isDone}
    const myReq = new XMLHttpmyReq();
    myReq.open('POST', '/api/add');
    myReq.onload = () => {
        const data = JSON.parse(myReq.responseText);
    }   
    const data = JSON.stringify(taskObj);
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
    count = 0;
    for (let i = 0; i < data.taskList.length; i++) {
        taskList.push(new Task(data.taskList[i].taskId, data.taskList[i].name, data.taskList[i].date, data.taskList[i].isDone))
        count++;
    }
    }
    const data = new FormData();
    data.append('id', '');
    myReq.send(data);
    render();
    return false;
}

init();