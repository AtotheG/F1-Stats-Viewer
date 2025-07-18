FROM python:3.12-slim AS base
WORKDIR /app
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY backend ./backend
CMD ["uvicorn", "backend.asgi:app", "--host", "0.0.0.0", "--port", "8000"]

FROM node:20 AS frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend ./frontend
RUN npm run build --workspace frontend

FROM base AS final
COPY --from=frontend /app/frontend/.next ./frontend/.next
CMD ["uvicorn", "backend.asgi:app", "--host", "0.0.0.0", "--port", "8000"]
