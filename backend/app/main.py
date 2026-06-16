from fastapi import FastAPI
from sqlalchemy import text

from app.db.session import engine
from app.db.base import Base
from app.db.models.user import User

from app.api.v1.auth import router as auth_router

app = FastAPI()

app.include_router(auth_router)

Base.metadata.create_all(bind=engine)


@app.get("/")
def test_connection():

    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "message": "Database connected successfully"
    }