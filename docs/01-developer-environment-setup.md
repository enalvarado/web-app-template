# Developer Environment Setup — Step by Step

Expands Section 1 of `claude-code-project-brief.md` into concrete setup steps. Written for Windows (matches the team's current machines); commands use `winget`, already built into Windows 11.

## 1. Get access

1. Create a GitHub account if you don't have one, then ask the repo owner to add you as a collaborator on `web-app-template`.
2. Request SQL Server dev instance credentials (or connection details) from whoever owns the shared dev database — needed later for backend/dropdown work, not for initial setup.

## 2. Install Git

```
winget install --id Git.Git -e --source winget
```

Verify: `git --version`

## 3. Install VS Code

```
winget install -e --id Microsoft.VisualStudioCode
```

## 4. Install the Claude Code extension

1. Open VS Code.
2. Go to the Extensions panel (`Ctrl+Shift+X`).
3. Search **Claude Code** and click Install.

## 5. Install Node.js (LTS) + npm

```
winget install OpenJS.NodeJS.LTS
```

Verify: `node -v` and `npm -v`

## 6. Install Python 3

```
winget install Python.Python.3.12
```

Verify: `python --version` and `pip --version`

## 7. Install Docker Desktop

```
winget install Docker.DockerDesktop
```

On first launch, enable the WSL2 backend if prompted. Docker Desktop must be running whenever you run the backend locally.

## 8. Install the ODBC Driver for SQL Server

Download and run the **ODBC Driver 18 for SQL Server** installer from Microsoft's official download page (required by `pyodbc`/SQLAlchemy to reach SQL Server locally).

## 9. Clone the repo

```
git clone https://github.com/enalvarado/web-app-template.git
```

## 10. Install recommended VS Code extensions

Via the Extensions panel, or from a terminal once `code` is on PATH:

```
code --install-extension ms-python.python
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

## 11. Create your local settings files

Each half of the app reads its settings from a `.env` file that isn't committed. Copy the examples, from the repo folder:

```
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

The defaults work for local use. The `API_KEY` in `backend\.env` must match `VITE_API_KEY` in `frontend\.env`, and they already do. Put your SQL Server details from step 1 in `DATABASE_URL`.

The example `DATABASE_URL` uses ODBC Driver 18 (installed in step 8) with `TrustServerCertificate=yes`. Driver 18 encrypts connections by default, and that setting lets it accept a dev server's self-signed certificate. Don't carry it over to production.

## 12. Run the backend

With Docker Desktop running, from the repo folder:

```
docker compose up --build
```

The API runs at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`. After changing code under `backend\app`, run `docker compose restart backend` to load it (no rebuild needed). Rebuild with `--build` only after changing `requirements.txt` or the `Dockerfile`. Stop it with `Ctrl+C`.

## 13. Run the frontend and the Form Builder

In a second terminal:

```
cd frontend
npm install
npm run dev
```

`npm install` is only needed the first time and after dependencies change.

- **The app:** `http://localhost:5173`. It lists the forms in `frontend\src\forms\`.
- **The Form Builder:** `http://localhost:5173/builder.html`. **Save to app** writes the form you're building into `frontend\src\forms\<id>\config.json`, and the app shows it straight away. Save to app works only here, on the dev server.

The frontend passes `/api` requests to the backend on port 8000. Forms open without the backend running, but submitting a form and SQL-backed dropdowns need it (and the SQL Server connection from step 11).

Builder drafts are kept in your browser, so they don't follow you to another browser or machine. Use this `localhost:5173` address rather than opening `form-builder.html` as a file, because each address keeps its own drafts.

## Done

At this point you should be able to run `git`, `node`, `npm`, `python`, `pip` and `docker` from a terminal, open the repo in VS Code with Claude Code, and run the app and Form Builder locally.
