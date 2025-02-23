from fastapi import FastAPI
from db import engine, Base
from routes import router
from fastapi.middleware.cors import CORSMiddleware
# Create database tables
origins = [
    "http://localhost",
    "http://localhost:3000",
]
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register routers
app.include_router(router)