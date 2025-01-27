import TaskManager from "./taskManager";
export default class project{
    constructor(name){
        this.name = name;
        this.taskManager = new TaskManager(this.name);
    }
}