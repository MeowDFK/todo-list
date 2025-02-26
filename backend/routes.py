from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from db import get_db
import models as models
import schemas as schemas
from crud import create_task, get_tasks_by_project, delete_task, update_task
from crud import create_project,get_projects, delete_project, update_project
from typing import List

router = APIRouter()
@router.post("/project", response_model=schemas.ProjectResponse)
def create_project_route(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return create_project(db, project)

@router.get("/project", response_model= List[schemas.ProjectResponse])
def get_projects_route(db:Session = Depends(get_db)):
    return get_projects(db)

@router.delete("/project/{project_id}", status_code=204)
def delete_project_route(project_id: int, db:Session = Depends(get_db)):
    project = delete_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return

@router.put("/project/{project_id}",response_model=schemas.ProjectResponse)
def update_project_route(project_id:int, project: schemas.ProjectCreate, db:Session = Depends(get_db)):
    updated_project = update_project(db,project_id,project)
    if not updated_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated_project

@router.post("/task", response_model=schemas.TaskResponse)
def create_task_route(task: schemas.TaskCreate, db:Session = Depends(get_db)):
    return create_task(db,task)

@router.get("/project/{project_id}/task", response_model=List[schemas.TaskResponse])
def get_tasks_by_project_route(project_id: int, db:Session = Depends(get_db)):
    task = get_tasks_by_project(db, project_id)
    return task

@router.delete("/task/{task_id}", status_code=204)
def delete_task_route(task_id: int, db:Session=Depends(get_db)):
    task = delete_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return

@router.put("/task/{task_id}", response_model=schemas.TaskResponse)
def update_task_route(task_id: int,task: schemas.TaskCreate, db:Session=Depends(get_db)):
    updated_task = update_task(db,task_id,task)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

