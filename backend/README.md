# URL Shortening Service — Backend (Django Rest Framework + MySQL)

A simple RESTful API for shortening long URLs, managing short links (CRUD), and tracking access statistics. Built with **Django Rest Framework (DRF)** and **MySQL**.

---

## Features

- ✅ Create a short URL (`POST /api/shorten/`)
- ✅ Retrieve a short URL record (`GET /api/shorten/{shortCode}/`)
- ✅ Update a short URL destination (`PUT /api/shorten/{shortCode}/`)
- ✅ Delete a short URL (`DELETE /api/shorten/{shortCode}/`)
- ✅ Get statistics (`GET /api/shorten/{shortCode}/stats/`)
- ✅ Redirect endpoint: `GET /api/r/{shortCode}/`  
- Increments `access_count` and redirects with **302**

---

## Tech Stack

- **Python** (3.12+)
- **Django** (6.0)
- **Django Rest Framework**
- **MySQL** (8.0+)

---

## Project Structure (Backend)

backend/
├─ short_url/ # Django project
│ ├─ settings.py
│ ├─ urls.py
│ └─ wsgi.py
├─ shortener/ # App
│ ├─ models.py
│ ├─ serializers.py
│ ├─ views.py
│ └─ urls.py
├─ manage.py
└─ requirements.txt


---

## Setup Instructions

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd URL-Shortening-Service/backend
```

### 2) Create and activate a virtual environment
#### Windows (PowerShell):
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

#### macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3) Install dependencies
```bash
pip install -r requirements.txt
```

## MySQL Database Setup
### 1) Create database
Login to MySQL and run:
```bash
CREATE DATABASE url_shortener_db
```

### 2) Configure environment variables
Create a .env file in backend/:
```bash
DJANGO_DEBUG=True
DJANGO_SECRET_KEY=your-secret-key
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost

DB_ENGINE=django.db.backends.mysql
DB_NAME=url_shortener_db
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306
```

***Ensure*** your settings.py reads from environment variables (example: os.getenv()).

### 3) Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

## Start the Server
```bash
python manage.py runserver
```


## API Endpoints
Get you api endpoints at:
```bash
http://127.0.0.1:8000/swagger/
```


