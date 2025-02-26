from fastapi import FastAPI
from db import engine, Base
from routes import router
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

# You can add additional URLs to this list, for example, the frontend's production domain, or other frontends.
allowed_origins = [
    "http://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

print(app.user_middleware)

app.include_router(router)