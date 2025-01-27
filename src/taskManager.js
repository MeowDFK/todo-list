import {format} from "date-fns";
import Task from './task.js';
const TaskList = document.getElementById("tasks");
const TaskDialog = document.getElementById("TaskDialog");

export default class TaskManager {
    constructor(parentProject) {
        this.parentProject=parentProject;
    }
    saveTask(taskInstance){
        let tasks = JSON.parse(localStorage.getItem(this.parentProject))||[];
        tasks.push(taskInstance);
        localStorage.setItem(this.parentProject,JSON.stringify(tasks));
    }
    deleteTask(target,taskText){
        target.remove();
        let tasks= JSON.parse(localStorage.getItem(this.parentProject))||[];
        tasks= tasks.filter(tasks=> tasks.title !== taskText);
        localStorage.setItem(this.parentProject,JSON.stringify(tasks));
    }
    loadTask(){
        let tasks = JSON.parse(localStorage.getItem(this.parentProject))||[];
        TaskList.querySelectorAll('li').forEach(task=>{
            task.remove();
        });
        tasks.forEach(task => {
            const taskInstance = new Task(task.title,task.description,task.dueDate,task.priority)
            this.addingTask(taskInstance);//not really a Task type
        });
    }
    addTask(title,description,dueDate,priority){
        const taskInstance = new Task(title,description,dueDate,priority);
        this.addingTask(taskInstance);
        this.saveTask(taskInstance);

    }
    addingTask(taskInstance){
        const task = document.createElement('li');
        task.className = 'w-full h-18 hover:border-white hover:border-solid hover:bg-violet-500 hover:text-white grid grid-cols-1 grid-rows-5 items-center rounded-md  order-dashed  text-sm text-violet-200 font-medium py-3 ';
        switch(taskInstance.priority) {
            case "priority1":
                task.className += " bg-gray-900  border-0 border-violet-200";
                break;
            case 'priority2':
                task.className += " bg-gray-900 border-dashed border-1 border-violet-200";
                break;
            case "priority3":
                task.className += " bg-gray-800  border-1 border-violet-200";
                break;
            case "priority4":
                task.className += " bg-gray-700  border-4 border-violet-200";
                break;
            default:
                //task.className += " bg-gray-900  border-0 border-violet-200";
                break;
        }
        const titleHtml = document.createElement('span');
        titleHtml.className =" text-2xl font-bold p-2 row-start-2";
        titleHtml.textContent = taskInstance.title;

        const dateHtml = document.createElement('span');
        dateHtml.className = " text-xs font-semibold text-right row-start-4 col-start-2 p-2 ";
        const [year, month, day] = taskInstance.dueDate.split("-");
        const formatDate = format(new Date(year, month, day),"yyyy-MM-dd");
        dateHtml.textContent = formatDate;

        const descriptionHtml = document.createElement('span');
        descriptionHtml.className = " text-xs p-2 row-start-5";
        descriptionHtml.textContent = taskInstance.description;
        const editBtn = document.createElement("button");

        editBtn.className="hover:bg-red-500  flex w-5 h-5";
        editBtn.innerHTML+=`<svg  fill="currentColor " class="size-5">
                        <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                    </svg>`;
        const deleteBtn = document.createElement("button");
        deleteBtn.className ="hover:bg-red-500  flex w-5 h-5";
        deleteBtn.innerHTML+=`<svg fill="currentColor" class="size-5">
        <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
        </svg>`;

        const buttons = document.createElement('span');
        buttons.className = "flex row-start-1 col-start-2 justify-self-end m-2";
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
    }
}