import {format} from "date-fns";
const TaskList = document.getElementById("tasks");
const TaskDialog = document.getElementById("TaskDialog");
class Task {
    constructor(title, description, dueDate, priority){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
    static saveTask(project,title,description,dueDate,priority){
        let project = JSON.parse(localStorage.getItem("project"))||[];
        project.push({title: title, description: description, dueDate:dueDate, priority: priority});
        localStorage.setItem("project",JSON.stringify(project));
    }
}