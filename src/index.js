import './style.css';
import ProjectManager from './projectManager.js';
import Task from './task.js';
let selectedProject = null;
let closeDialogButtons = document.getElementsByName('closeDialog');
let input = document.getElementById("todo-input");
let projectList = document.getElementById("projects");
const TaskDialog = document.getElementById("TaskDialog");


const ProjectDialog = document.getElementById("ProjectDialog");
const ProjectForm = ProjectDialog.querySelector("form");
const AddProjectButtons =  document.getElementsByName("AddProjectButton");
const AddTaskButtons = document.getElementsByName("AddTaskButton");

AddProjectButtons.forEach(button=>{
    button.addEventListener("click", () =>{
        ProjectDialog.showModal();
    });
});
AddTaskButtons.forEach(button=>{
    button.addEventListener("click", () =>{
        TaskDialog.showModal();
    });
});
closeDialogButtons.forEach(button=>{
    button.addEventListener("click", () =>{
        ProjectDialog.close();
        TaskDialog.close();
    });
});
ProjectForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const name = ProjectForm.elements["projectName"];
    ProjectManager.addProject(name.value);
    name.value="";
    ProjectDialog.close();
});

//document.getElementById("addPrjectButton").addEventListener("click", addPrject);

/*note: localStorage用法
    任何操作->
        1.load from storage using JSON.parse()
        2.do the operation
        3.set the item to storage (remember using JSON.stringify())*/
window.onload = function(){

    ProjectManager.loadProjects();

}






