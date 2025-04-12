import {format} from "date-fns";
import Task from './task.js';
const TaskList = document.getElementById("tasks");
const TaskDialog = document.getElementById("TaskDialog");
let editMode = false;
let currentEditing =null;
var url = process.env.BACKEND_URL;
export default class TaskManager {
    constructor(project_id) {
        this.project_id=project_id;
        this.taskName_idMap = new Map();
    }
    async saveTask(taskInstance){
        taskInstance.project_id = this.project_id;
        //console.log(JSON.stringify(taskInstance, null, 2));
        try {
            const response = await fetch(url+"/task",{
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify(taskInstance),
            });
            const task = await response.json();
            //console.log(task);
            this.taskName_idMap.set(task.title,task.id);
            //console.log(this.taskName_idMap);
            this.addingTask(taskInstance);
        }
        catch (error) {
            console.error(error);
        }
    }
    async getTask(){
        try {
            const response = await fetch(url+`/project/${this.project_id}/task`,{
                method: 'GET',
            });
            const tasks = response.json();
            return tasks;
        }catch (error){
            console.error(error);
        }
    }
    async deleteTask(target,taskText){
        target.remove();
        const id = this.taskName_idMap.get(taskText);
        this.taskName_idMap.delete(taskText);
        try{
            const response = await fetch(url+`/task/${id}`,{
                method: 'DELETE',
            })
        }catch(error){
            console.error(error);
        }
    }
    async loadTask(){
        const tasks = await this.getTask();
        TaskList.querySelectorAll('li').forEach(task=>{
            task.remove();
        });
        tasks.forEach(task => {
            const taskInstance = new Task(task.title,task.description,task.due_date,task.priority)
            this.taskName_idMap.set(task.title,task.id);
            this.addingTask(taskInstance);//not really a Task type
        });
    }
    async updateTask(oldName, newInstance){
        const id = this.taskName_idMap.get(oldName);
        newInstance.project_id = this.project_id;
        //console.log(this.taskName_idMap);
        try{
            const response = await fetch(url+`/task/${id}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newInstance),
            })
            const task = await response.json();
            //console.log(task);
            this.taskName_idMap.set(task.title,task.id);
            this.addingTask(newInstance);
            this.taskName_idMap.delete(oldName);
        }catch(error){
            console.error(error);
        }
    }
    async addTask(title,description,due_date,priority){
        let str = title + ' ';
        let offset = 0;
        const tasks = await this.getTask();
        tasks.forEach(task=> {
            tasks.forEach(task=> {
                if(task.title === str){
                    offset += 1;
                    str = title+"("+offset+")";
                }
            });
        });
        const taskInstance = new Task(str,description,due_date,priority);
        if(editMode && currentEditing){
            const oldName = currentEditing.querySelector('.title').textContent;
            this.updateTask(oldName,taskInstance);
            currentEditing.remove();
            editMode = false;
            currentEditing=null;
        }else{
            this.saveTask(taskInstance);
        }


    }
    addingTask(taskInstance){
        const task = document.createElement('li');
        task.className = 'task';
        switch(taskInstance.priority) {
            case "priority1":
                task.className += " priority1";
                break;
            case 'priority2':
                task.className += " priority2";
                break;
            case "priority3":
                task.className += " priority3";
                break;
            case "priority4":
                task.className += " priority4";
                break;
            default:
                //task.className += " bg-gray-900  border-0 border-violet-200";
                break;
        }
        const titleHtml = document.createElement('span');
        titleHtml.className ="title";
        titleHtml.textContent = taskInstance.title;

        const dateHtml = document.createElement('span');
        dateHtml.className = " date";
        const [year, month, day] = taskInstance.due_date.split("-");
        const formatDate = format(new Date(year, month-1, day),"yyyy-MM-dd");
        dateHtml.textContent = formatDate;

        const descriptionHtml = document.createElement('span');
        descriptionHtml.className = " description";
        descriptionHtml.textContent = taskInstance.description;
        const editBtn = document.createElement("button");

        editBtn.className="editBtn";
        editBtn.innerHTML+=`<svg  fill="currentColor " class="size-5">
                        <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                    </svg>`;
        const deleteBtn = document.createElement("button");
        deleteBtn.className ="deleteBtn";
        deleteBtn.innerHTML+=`<svg fill="currentColor" class="size-5">
        <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
        </svg>`;

        const buttons = document.createElement('span');
        buttons.className = "Btn-container";
        buttons.appendChild(editBtn);
        buttons.appendChild(deleteBtn);
        task.appendChild(titleHtml);
        task.appendChild(dateHtml);
        task.appendChild(descriptionHtml);
        task.appendChild(buttons);
        TaskList.appendChild(task);
        deleteBtn.addEventListener("click",() =>{
            this.deleteTask(task, taskInstance.title);
        });
        editBtn.addEventListener("click",() =>{
            editMode = true;
            currentEditing = task;
            TaskDialog.showModal();
        });
    }
}