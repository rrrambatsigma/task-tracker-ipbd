# task-tracker-ipbd
Hands On Week 1 - Infrastruktur dan Platfrom Big Data

---

## ▶️ Cara Menjalankan Project

### 🔹 1. Clone Repository

```bash
git clone https://github.com/rrrambatsigma/task-tracker-ipbd.git
cd task-tracker-ipbd
```

---

### 🔹 2. Jalankan Backend (FastAPI)

Pastikan sudah install Python & pip.

```bash
venv\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload
```

Akses API di:

```
http://localhost:8000
```

Swagger Docs:

```
http://localhost:8000/docs
```

---

### 🔹 3. Jalankan Frontend (React)

Buka terminal baru:

```bash
cd frontend
npm install
npm run dev
```

Akses frontend di:

```
http://localhost:5173
```

---

### 🔹 4. Login & Gunakan API

1. Buka Swagger (`/docs`)
2. Gunakan endpoint:

   ```
   POST /api/login
   ```
3. Copy token yang didapat
4. Klik tombol **Authorize**
5. Masukkan:

   ```
   Bearer <token>
   ```
6. Sekarang semua endpoint bisa digunakan

---

### 🔹 5. Menjalankan dengan Docker

```bash
docker build -t task-tracker-api .
docker run -d -p 8000:8000 task-tracker-api
```

Akses:

```
http://localhost:8000
```

---

## Catatan

* Backend berjalan di port **8000**
* Frontend berjalan di port **5173**
* Token wajib untuk akses endpoint `/api/tasks`

---