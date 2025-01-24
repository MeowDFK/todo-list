import {format} from "date-fns";
class Task {
    constructor(title, description, dueDate, priority){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
    set title(value){
        if (!value.trim()) {
            throw new Error("Title cannot be empty.");
        }
        this._title = value;
    }
    get title() {
        return this._title;
    }
    set dueDate(value){
        if (isNaN(Date.parse(value))) {
            throw new Error("Invalid due date.");
        }
        this._dueDate = format(value,"yyyy-MM-dd");
    }
    get dueDate() {
        return this._dueDate;
    }
}