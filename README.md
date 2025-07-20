# F1 Weekend Insights

## Running the Stack

```bash
docker-compose up --build
```

This will build and start the FastAPI backend and Next.js frontend along with
Postgres and Redis. The compose configuration references the Dockerfiles in the
`backend` and `frontend` directories.

For convenience, you can start the stack using `run-stack.bat` on Windows or `./run-stack.sh` on Linux/macOS.
These scripts build and start the containers, wait a few seconds and then open http://localhost:3000 in your browser.
The backend API is reachable at http://localhost:8000 when the compose stack is running.
The frontend issues requests using `/api` paths. If `NEXT_PUBLIC_API_BASE_URL` is
set, Next.js rewrites those paths to `${NEXT_PUBLIC_API_BASE_URL}/api/*`, letting
the frontend stay agnostic of the backend's host. The provided `docker-compose.yml`
defines this variable so the frontend automatically points at the backend
container.

## Configuration

The backend proxies requests to the [jolpica-f1](https://github.com/jolpica/jolpica-f1)
API. The upstream base URL is configured through the `JOLPICA_BASE_URL`
environment variable which defaults to `https://api.jolpi.ca` if not specified.
The public service only retains the last ten seasons. If you need data older
than that, run your own jolpica-f1 instance and set `JOLPICA_BASE_URL` to its
address.

Every backend route mirrors its jolpica counterpart. For example,
`/api/series` simply forwards to `${JOLPICA_BASE_URL}/series`. Routes under
`/api/driver`, `/api/events` and others follow the same pattern so your
frontend can use the jolpica-f1 API documentation as a reference.

## Running Tests

Install the Python dependencies if they are not already present:

```bash
pip install -r backend/requirements.txt
```

Then execute the test suite from the repository root:

```bash
pytest
```

### Frontend Tests

To run the frontend test suite:

```bash
cd frontend
npm install
npm test
```

The repository contains a single sample test in `frontend/__tests__/sample.test.js`. Additional test files can be added under `frontend/__tests__/`.
