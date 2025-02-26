import TaskManager from "./taskManager";
export default class project{
    constructor(id){
        this.id = id;
        this.taskManager = new TaskManager(this.id);
    }
}