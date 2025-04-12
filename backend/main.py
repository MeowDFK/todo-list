from fastapi import FastAPI
from db import engine, Base
from routes import router
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv


load_dotenv(override=True)
Base.metadata.create_all(bind=engine)

app = FastAPI()

# You can add additional URLs to this list, for example, the frontend's production domain, or other frontends.
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

print(app.user_middleware)

app.include_router(router)