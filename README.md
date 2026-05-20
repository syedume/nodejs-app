# Aetheria | Premium Futuristic Goods Store

Aetheria is a premium, visually stunning full-stack E-commerce catalog and shopping cart application built using:
- **Frontend**: React (Vite) styled with high-fidelity Vanilla CSS, fluid animations, HSL glow effects, and Lucide React icons.
- **Backend**: Python (FastAPI) structured with SQLAlchemy ORM and Pydantic schemas.
- **Database**: PostgreSQL (with automatic SQLite fallback for lightweight local development).

This repository is split into two cleanly separated folders (`/frontend` and `/backend`) making it ready for multi-container orchestration.

---

## 🚀 Running Locally (Without Docker)

You can launch both applications locally to see the aesthetic styling and database synchronizations in action.

### 1. Start the Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The API will be available at `http://localhost:8000`. You can inspect the auto-generated documentation at `http://localhost:8000/docs`.*
   *Note: Since no `DATABASE_URL` was provided, the backend automatically seeds a local SQLite database (`aetheria.db`) with premium mock data.*

### 2. Start the Frontend App
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *Vite starts on `http://localhost:5173`. Any calls to `/api` are automatically proxied to the backend on `http://localhost:8000` via our configuration in `vite.config.js`.*

---

## 🐳 Dockerization Architecture Tips

As you begin writing the Docker files, here is the recommended structure for seamless multi-container orchestration.

### 1. Recommended Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
# Use official lightweight Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Install system dependencies needed for compiling psycopg2 (if using non-binary or for safety)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose FastAPI default port
EXPOSE 8000

# Start server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Recommended Frontend Dockerfile (`frontend/Dockerfile`)
For a production environment, use a multi-stage build that compiles the React app and serves it via an Nginx web server:
```dockerfile
# Stage 1: Build the React bundle
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy built assets to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom Nginx configuration to handle SPA routing and reverse-proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

> [!NOTE]
> When serving Vite assets via Nginx in production, make sure to supply a basic `nginx.conf` that acts as a reverse proxy, forwarding requests from `/api` to the backend container (e.g. `http://backend:8000`).

### 3. Recommended Orchestration (`docker-compose.yml`)
Create a `docker-compose.yml` file in the root of the project to hook everything up, including a persistent PostgreSQL volume:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: aetheria_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yoursecurepassword
      POSTGRES_DB: aetheria
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    container_name: aetheria_backend
    restart: always
    ports:
      - "8000:8000"
    environment:
      # Inject the PostgreSQL link string - FastAPI handles this automatically!
      - DATABASE_URL=postgresql://postgres:yoursecurepassword@db:5432/aetheria
    depends_on:
      - db

  frontend:
    build: ./frontend
    container_name: aetheria_frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  pgdata:
```

### Key Integrations in Docker Setup:
- **Database URL Injection**: The backend uses environment variable `DATABASE_URL` to create the SQLAlchemy engine. When launching via `docker-compose`, passing `DATABASE_URL=postgresql://...` will make the backend automatically target the PostgreSQL container (`db`) instead of falling back to SQLite.
- **Auto-Migration / Table Creation**: The backend handles table creations and inserts standard mock products automatically on startup (`models.Base.metadata.create_all(bind=engine)`), meaning the DB will be ready to go the moment the containers spin up!
