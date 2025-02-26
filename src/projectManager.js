import Task from './task.js';
import Project from './Project.js';
const ProjectList = document.getElementById("projects");
const ProjectDialog = document.getElementById("ProjectDialog");
const TaskDialog = document.getElementById("TaskDialog");
const TaskForm = TaskDialog.querySelector("form");
const AddTaskButtons = document.getElementsByName("AddTaskButton");
let editMode = false;
let currentEditing =null;
let curTaskManager =null;
var projectMap = new Map();
var htmlMap = new Map();
var projectName_idMap = new Map();
var url = process.env.BACKEND_URL;
TaskForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const title = TaskForm.elements["Title"].value;
    const description = TaskForm.elements["Description"].value;
    const date = TaskForm.elements["Date"].value;
    const priority = TaskForm.elements["Priority"].value;
    curTaskManager.addTask(title, description, date, priority);
    TaskForm.reset();
    TaskDialog.close();
});
export default class ProjectManager{
    static VisAddTaskButton(){
        AddTaskButtons.forEach(button=>{
            button.classList.remove("hidden");
            button.classList.add("flex");
        })

    }
    static hideAddTaskButtons(){
        AddTaskButtons.forEach(button=>{
            button.classList.remove("flex");
            button.classList.add("hidden");
        })
    }
    static setTaskManager(projectInstance){
        curTaskManager = projectInstance.taskManager;
        curTaskManager.loadTask();
        this.VisAddTaskButton();
    }
    static async resetTaskManager(){
        curTaskManager = null;
        this.hideAddTaskButtons();

        const project = await this.getProjects();
        if(project[0]){
            htmlMap.get(project[0].id).click();
        }

    }
    static async getProjects(){
        try{
            const response = await fetch(url+"/project",{
                method: "GET",
            })
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const project = await response.json();
            return project;
        }catch (error){
            console.error(error.message);
        }
    }
    static async saveProject(str) {
        try{
            const response = await fetch(url+"/project",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "name": str }),
            })
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const project = await response.json();
            console.log(project);
            const projectInstance = new Project(project.id);
            this.setTaskManager(projectInstance);
            const id = project.id
            projectMap.set(id,projectInstance);
            projectName_idMap.set(str,id);
            htmlMap.set(id,this.addingProject(project));
            htmlMap.get(id).click();
        } catch (error) {
          console.error(error.message);
        }
    }
    static async deleteProject(target,project_json) {
        const id = project_json.id;
        try{
            const response = await fetch(url+`/project/${id}`,{
                method: "DELETE",
            })
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            target.remove();
            this.updateMap(project_json)
        }catch (error) {
            console.error(error.message);
        }
        this.resetTaskManager();
    }
    static updateMap(project_json){
        const id = project_json.id;
        const name = project_json.name;
        projectName_idMap.delete(name);
        projectMap.delete(id);
        htmlMap.delete(id);
    }
    static async updateProject(oldName,newName){
        const id = projectName_idMap.get(oldName);
        try{
            const response = await fetch(url+`/project/${id}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "name": newName }),
            })
            const newProject = response.json();
            projectName_idMap.set(newProject.name, newProject.id);
            projectName_idMap.delete(oldName);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }catch (error) {
            console.error(error.message);
        }
    }
    static async loadProjects(){

        const projects = await this.getProjects();
        console.log("Fetched data:", projects);
        projects.forEach(project=> {
            const projectInstance = new Project(project.id);
            projectMap.set(project.id,projectInstance);
            projectName_idMap.set(project.name,project.id);
            htmlMap.set(project.id,this.addingProject(project));
        });
        this.resetTaskManager();

    }
    static addingProject(project_json){
        const project = document.createElement("li");
        project.className="project";
        project.innerHTML +=`<t>${project_json.name}</t>`;
        const project_a = document.createElement("a");
        project_a.className="flex";
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
        //const project = projectList.get(`#${value}`);
        //const deleteBtn = projectList.querySelector(`#Delete${value}`)
        editBtn.addEventListener("click",()=>{
            editMode=true;
            currentEditing=project;
            ProjectDialog.showModal();
        });
        project.addEventListener("click", () => {
            document.querySelectorAll("#projects li").forEach(p => {
                p.classList.remove("selected-li");
                p.classList.add("unselected-li");
            });

            console.log("Current ProjectMap:", projectMap);
            console.log("Looking for:", project_json.name, "Found:", projectMap.get(project_json.id).taskManager.parentProject);
            const projectInstance = projectMap.get(project_json.id);
            this.setTaskManager(projectInstance);
            // Set clicked project as active
            project.classList.add("selected-li");
            project.classList.remove("unselected-li");
        });
        deleteBtn.addEventListener("click",(event)=>{
            event.stopPropagation();
            this.deleteProject(project,project_json);
        });
        project_a.appendChild(editBtn);
        project_a.appendChild(deleteBtn);
        project.appendChild(project_a);
        ProjectList.appendChild(project);
        return project;
    }

    static async addProject(value){
        this.VisAddTaskButton();
        if(value.trim()!==""){
            let str = value;
            let offset = 0;
            let projects = await this.getProjects();
            projects.forEach(project=> {
                projects.forEach(project=> {
                    if(project.name === str){
                        offset += 1;
                        str = value+"("+offset+")";
                    }
                });
            });

            if (editMode && currentEditing){
                const oldName = currentEditing.querySelector("t").textContent;
                currentEditing.querySelector("t").textContent = str;
                editMode = false;
                this.updateProject(oldName,str);
                currentEditing = null;
            }
            else this.saveProject(str);
        }
    }

}