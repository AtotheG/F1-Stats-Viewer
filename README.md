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

## Configuration

The backend proxies requests to the public [jolpica](https://jolpi.ca) API. The
upstream base URL can be configured through the `JOLPICA_BASE_URL` environment
variable which defaults to `https://api.jolpi.ca` if not specified.  Each route
exposed by the backend mirrors the corresponding jolpica endpoint.  For example,
`/series` on the backend simply forwards to `${JOLPICA_BASE_URL}/series`.

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
