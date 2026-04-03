from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware  # ← tambah ini
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
import uuid
from enum import Enum

# =========================
#  INIT APP
# =========================
app = FastAPI(
    title="Task Tracker API",
    version="FINAL",
    openapi_tags=[
        {"name": "Auth"},
        {"name": "Tasks"}
    ]
)


# =========================
#  CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
#  SECURITY SETUP
# =========================
security = HTTPBearer()
active_tokens = []

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    if token not in active_tokens:
        raise HTTPException(status_code=401, detail="Invalid token")

# =========================
#  ENUM (VALIDASI)
# =========================
class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class Status(str, Enum):
    pending = "pending"
    done = "done"

# =========================
#  SCHEMA
# =========================
class Task(BaseModel):
    id: Optional[str] = None
    title: str
    priority: Priority
    deadline: date
    status: Status = Status.pending
    kategori: str

class Login(BaseModel):
    username: str
    password: str

# =========================
#  DATABASE (SIMULASI)
# =========================
database_tasks: List[Task] = []

# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {"message": "Task Tracker API 🔥"}

# =========================
# LOGIN
# =========================
@app.post("/api/login", tags=["Auth"])
def login(user: Login):
    if user.username and user.password:
        token = str(uuid.uuid4())
        active_tokens.append(token)

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    raise HTTPException(status_code=401, detail="Login gagal")

# =========================
# CREATE TASK
# =========================
@app.post("/api/tasks", tags=["Tasks"])
def create_task(task: Task, _: None = Depends(verify_token)):
    task.id = str(uuid.uuid4())
    database_tasks.append(task)

    return {
        "message": "Task berhasil ditambahkan",
        "data": task
    }

# =========================
# GET TASKS
# =========================
@app.get("/api/tasks", response_model=List[Task], tags=["Tasks"])
def get_tasks(
    status: Optional[Status] = None,
    priority: Optional[Priority] = None,
    kategori: Optional[str] = None,
    _: None = Depends(verify_token)
):
    result = database_tasks

    if status:
        result = [t for t in result if t.status == status]

    if priority:
        result = [t for t in result if t.priority == priority]

    if kategori:
        result = [t for t in result if t.kategori == kategori]

    return result

# =========================
#  UPDATE TASK
# =========================
@app.put("/api/tasks/{task_id}", tags=["Tasks"])
def update_task(task_id: str, updated_task: Task, _: None = Depends(verify_token)):
    for i, task in enumerate(database_tasks):
        if task.id == task_id:
            updated_task.id = task_id
            database_tasks[i] = updated_task
            return {
                "message": "Task berhasil diupdate",
                "data": updated_task
            }

    raise HTTPException(status_code=404, detail="Task not found")

# =========================
#  DELETE TASK
# =========================
@app.delete("/api/tasks/{task_id}", tags=["Tasks"])
def delete_task(task_id: str, _: None = Depends(verify_token)):
    for i, task in enumerate(database_tasks):
        if task.id == task_id:
            deleted = database_tasks.pop(i)
            return {
                "message": "Task berhasil dihapus",
                "data": deleted
            }

    raise HTTPException(status_code=404, detail="Task not found")

# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
def health():
    return {"status": "OK"}