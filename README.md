# F1 Weekend Insights

Development environment:

```bash
docker-compose up --build
```

This will build and start the FastAPI backend and Next.js frontend along with
Postgres and Redis. The compose configuration references the Dockerfiles in the
`backend` and `frontend` directories.

For convenience, you can start the stack using `run-stack.bat` on Windows or `./run-stack.sh` on Linux/macOS.
These scripts build and start the containers, wait a few seconds and then open http://localhost:3000 in your browser.
