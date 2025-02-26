from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from db import get_db
import models as models
import schemas as schemas
router = APIRouter()


def create_project(db:Session, project: schemas.ProjectCreate):
    new_project = models.Project(**project.model_dump())
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

def get_projects(db: Session):
    return db.query(models.Project).all()

def update_project(db: Session, project_id: int, project_data: schemas.ProjectCreate):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        return None # the error code is return in the router not inside crud operations!!!
    for key, value in project_data.model_dump().items():
        setattr(project,key,value)
    db.commit()
    db.refresh(project)
    return project

def delete_project(db: Session, project_id: int):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        return None
    db.delete(project)
    db.commit()
    return project

def create_task( db:Session,task:schemas.TaskCreate):
    new_task = models.Task(**task.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

def get_tasks_by_project(db:Session, project_id: int):
    return db.query(models.Task).filter(models.Task.project_id == project_id).all()

def update_task(db:Session, task_id:int, task_data:schemas.TaskCreate):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        return None
    for key, value in task_data.model_dump().items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task

def delete_task(db:Session, task_id:int):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        return None
    db.delete(task)
    db.commit()
    return task
