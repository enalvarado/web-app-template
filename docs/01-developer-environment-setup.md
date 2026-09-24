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

## Done

At this point you should be able to: clone the repo, open it in VS Code with Claude Code available, and run `git`, `node`, `npm`, `python`, `pip`, and `docker` from a terminal. Frontend/backend run commands will be added once the template's folder structure (Section 9) is in place.
