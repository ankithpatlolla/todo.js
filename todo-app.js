function Task(props) {
    return <li>{props.name}, {props.dueDate}, {props.delete}</li>
}

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list: props.list};

        this.handleAddTask = this.handleAddTask.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
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
    render() {
        return (
            <div>
                <h1>TODO List</h1>
                <ol>
                    {
                        this.state.list.map((t) =>
                            <Task key={t.id} name={t.name} dueDate={t.dueDate} delete={t.delete}/>)
                    }
                </ol>
                <TaskNameForm onAddTask={this.handleAddTask} onDelete={this.handleDelete}/>
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
        dueDate: this.state.dueDate, delete: <button type = "button" 
        onClick = {() => this.handleDelete(id)}>Delete</button>};
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