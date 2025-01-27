const ProjectList = document.getElementById("projects");
const ProjectDialog = document.getElementById("ProjectDialog");
let editMode = false;
let currentEditing =null;
export default class Project{
    editMode=true;
    currentEditing=project;
    constructor(name){
        this.name = name;
    }
    static saveProject(value){
        let projects = JSON.parse(localStorage.getItem("projects")) || [];
        projects.push({name:value});
        localStorage.setItem("projects",JSON.stringify(projects));
    }
    static deleteProject(target,projectText) {
        target.remove();
        let projects = JSON.parse(localStorage.getItem("projects")) || [];
        //filter不會直接影響caller
        projects = projects.filter(project=>project.name !== projectText);
        localStorage.setItem("projects",JSON.stringify(projects));
    }
    static loadProjects(){
        let projects = JSON.parse(localStorage.getItem("projects"))||[];
        projects.forEach(project=> {
            this.addingProject(project.name)
        });
    }
    static addingProject(value){
        const project = document.createElement("li");
        project.className="active:bg-purple-500 p-2 w-full  hover:border-white hover:border-solid hover:bg-violet-500 hover:text-white flex flex-row justify-between rounded-md border-violet-200 border-2 text-sm leading-6 text-violet-200 font-medium py-3";
        project.innerHTML +=`<t>${value}</t>`;
        const project_a = document.createElement("a");
        project_a.className="flex";
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
        //const project = projectList.get(`#${value}`);
        //const deleteBtn = projectList.querySelector(`#Delete${value}`);
        deleteBtn.addEventListener("click",()=>{
            this.deleteProject(project,value);
        });
        editBtn.addEventListener("click",()=>{
            editMode=true;
            currentEditing=project;
            ProjectDialog.showModal();
        });
        project.addEventListener("click", () => {
            document.querySelectorAll("#projects li").forEach(p => {
                p.classList.remove("bg-violet-500", "text-white", "border-white");
                p.classList.add("border-violet-200", "text-violet-200");
            });

            // Set clicked project as active
            project.classList.add("bg-violet-500", "text-white", "border-white");
            project.classList.remove("border-violet-200", "text-violet-200");
        });
        project_a.appendChild(editBtn);
        project_a.appendChild(deleteBtn);
        project.appendChild(project_a);
        ProjectList.appendChild(project);
    }
    static addProject(value){

        if(value.trim()!==""){
            let str = value;
            let offset = 0;
            let projects = JSON.parse(localStorage.getItem("projects"))||[];
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
                this.deleteProject(currentEditing,oldName);
                currentEditing = null;
            }
            this.addingProject(str);
            this.saveProject(str);
        }
    }

}