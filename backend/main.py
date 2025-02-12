from fastapi import FastAPI
from db import engine, Base
from routes import router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Register routers
app.include_router(router)