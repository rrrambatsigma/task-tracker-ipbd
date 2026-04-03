# Gunakan image python
FROM python:3.11-slim

WORKDIR /app

# Copy kode
COPY main.py .

# Install dependencies
RUN pip install fastapi uvicorn pydantic

EXPOSE 8000

# Perintah untuk menjalankan FastAPI menggunakan Uvicorn di dalam container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]