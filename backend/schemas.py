from pydantic import BaseModel
from typing import List
from datetime import date
class TaskCreate(BaseModel):
    title: str
    description: str
    due_date: date
    priority: int
    project_id: int


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    due_date: date
    priority: int
    project_id: int

    class Config:
        orm_mode = True


class ProjectCreate(BaseModel):
    name: str


class ProjectResponse(BaseModel):
    id: int
    name: str
    tasks: List[TaskResponse]

    class Config:
        orm_mode = True
