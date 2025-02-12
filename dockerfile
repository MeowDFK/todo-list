FROM python:3.11-slim

WORKDIR /todo_backend

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ /todo_backend/

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
