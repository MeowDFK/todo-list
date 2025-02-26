from sqlalchemy import Column, String, ForeignKey, Integer, Date
from sqlalchemy.orm import relationship
from sqlalchemy.schema import UniqueConstraint
from db import Base
#only know that index give efficiency in sorting or query in sql but further usage remains unknown but i decide to keep it for no reason...
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    tasks = relationship("Task", back_populates="project", cascade = "all, delete")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, index=True)
    due_date = Column(Date, index=True)
    priority = Column(String, index=True)
    project_id = Column(Integer, ForeignKey("projects.id",ondelete="CASCADE"))

    project = relationship("Project", back_populates="tasks")
    __table_args__ = (UniqueConstraint("title", "project_id", name="uq_task_title_per_project"),)