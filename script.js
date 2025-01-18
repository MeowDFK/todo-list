let input = document.getElementById("todo-input");
let todoList = document.getElementById("todos");
/*note: localStorage用法
    任何操作-> 
        1.load from storage using JSON.parse()
        2.do the operation
        3.set the item to storage (remember using JSON.stringify())*/
window.onload = function(){
    loadTodos();
}
function loadTodos(){
    let todos = JSON.parse(localStorage.getItem("todos"))||[];
    todos.forEach(todo=> {
        addingTodo(todo.task,todo.isCompleted)
    });
}
function updateTodo(task,isCompleted){
    let todos = JSON.parse(localStorage.getItem("todos"))||[];
    todos = todos.map(todo=>{
        if(todo.task === task){
            todo.isCompleted = isCompleted;
        }
        return todo;
    });
    localStorage.setItem("todos",JSON.stringify(todos));
}
function addTodo(){
    
    if(input.value.trim()!==""){
        let str = input.value;
        let offset = 0;
        let todos = JSON.parse(localStorage.getItem("todos"))||[];
        todos.forEach(todo=> {
            if(todo.task === str){
                offset += 1;
                str = input.value+"("+offset+")";
            }
        });
        
        addingTodo(str,false);
        saveTodo(str,false);
    }
    input.value = "";
}
function addingTodo(inputValue,isCompleted){
    let TodoDiv = document.createElement("span");
        let taskText = document.createTextNode(" " + inputValue);
        let newTodo = document.createElement("li");
        let deleteBtn = document.createElement("Button");
        deleteBtn.textContent = "X";
        deleteBtn.id ="BtnDelete";
        deleteBtn.onclick  = function () {
            deleteTodo(TodoDiv,inputValue);
            
        };
        

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked=isCompleted;
        
        checkbox.onchange = function () {
            updateTodo(inputValue,checkbox.checked);
            completeTask(newTodo, taskText.textContent, checkbox.checked);
        };
        
        newTodo.appendChild(taskText);

        TodoDiv.appendChild(checkbox);
        TodoDiv.appendChild(newTodo);
        TodoDiv.appendChild(deleteBtn);

        todoList.appendChild(TodoDiv);
        completeTask(newTodo, taskText.textContent, checkbox.checked);
        //List.push(input)
}
function deleteTodo(target,taskText) {
    target.remove();  

    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    //filter不會直接影響caller
    todos = todos.filter(todo=>todo.task !== taskText);
    localStorage.setItem("todos",JSON.stringify(todos));
}
function saveTodo(task, isCompleted){
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push({task:task,isCompleted:isCompleted});
    localStorage.setItem("todos",JSON.stringify(todos));
}
function completeTask(target, text, isChecked) {
    if (isChecked) {
        
        target.innerHTML = `<p><s>${text}</s> &#128526&#129395&#128576</p>`;
    } else {
        
        target.textContent = text;
    }
}