function Task(props) {
    if (props.isDone === true) {
        return <li> <b>{props.name} {props.dueDate} {props.isDone} {props.mark} {props.delete} </b></li>
    } else {
        return <li> {props.name} {props.dueDate} {props.isDone} {props.mark} {props.delete} </li>
    }
}

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list: props.list};

        this.handleAddTask = this.handleAddTask.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleMark = this.handleMark.bind(this);
    }
    handleAddTask(task) {
        console.log("add task clicked");
        this.state.list.push(task);
        this.setState({list: this.state.list})
    }

    handleDelete(id) {
        const filteredTasks = this.state.list.filter(task => task.id !== id);
        this.setState({
            list: filteredTasks
        })
    }

    handleMark (id) {
        const markTask = this.state.list.filter((task) => {
            if (task.id === id) {
                if (task.isDone === true) {
                    task.isDone = false;
                } else {
                    task.isDone = true;
                }
            }
            return task;
        })
        this.setState({
            list: markTask
        })
    }

    render() {
        return (
            <div>
                <h1>TODO List</h1>
                <ol>
                    {
                        this.state.list.map((t) =>
                            <Task key={t.id} name={t.name} dueDate={t.dueDate} isDone={t.isDone} mark={t.mark} delete={t.delete}/>)
                    }
                </ol>
                <TaskNameForm onAddTask={this.handleAddTask} onDelete={this.handleDelete} onMark={this.handleMark}/>
            </div>
        );
    }
}

class TaskNameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: '', dueDate: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }

    handleSubmit(event) {
        const taskList = this.props.taskList;
        // create a task object
        event.preventDefault();
        const id = Date.now();
        const task = {id:id, name: this.state.value, 
        dueDate: this.state.dueDate, isDone: false, 
        mark: <input type = "checkbox" onClick = {() => this.handleMark(id)}></input>,
        delete: <button type = "button" onClick = {() => this.handleDelete(id)}>Delete</button>};
        // add the task object to the task list
        this.props.onAddTask(task);
        this.state.value = "";
        this.state.dueDate = "";
        
    }

    handleChange(event) {
        // code to set the state of the component
        this.setState({value: event.target.value});
    }

    handleDate(event) {
        this.setState({dueDate: event.target.value});
    }

    handleDelete(id) {
        this.props.onDelete(id);
    }

    handleMark(id) {
        this.props.onMark(id);
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.value} 
                onChange={this.handleChange} required />
                <input type="date" id = "dueDate" value = {this.state.dueDate} onChange = {this.handleDate} required/>
                <input type="submit" value="Add Task" />

            </form>
        );
    }
}

ReactDOM.render(
    <TodoList list={[]} />,
    document.getElementById('todo')
);