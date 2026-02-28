
# Project structure

- `apps/*` - This folder contains the applications themselves:
  - `apps/front-end` - The client-side application (Next.js, TypeScript).
  - `apps/back-end` - The server-side application (NestJS, Drizzle ORM, TypeScript).

Each application is self-contained, with its own configuration, dependencies, and environment variables.
- `packages/*` - "libs" or "shared packages" with re-usable code
    - This folder contains shared libraries and utilities 
  > Useful utils snippets can be stored there if you plan on re-use them accross applications. Also types for API responses/requests will be stored there to make it easier and less "copy-paste".

# Project stack
This project is a TypeScript-based monorepo that includes both backend and frontend applications. It is designed with scalability and maintainability in mind, leveraging modern frameworks and tools.
- Back-end:
  - NestJS is used as the main backend framework, providing a modular and structured architecture.
  - DataBase Layer: Drizzle ORM is integrated for type-safe database queries and migrations.
- Front-end:
  - Framework:  Currently a work in progress (WIP). The frontend is being developed with modern web technologies, ensuring seamless integration with the backend.
- General:
  -  Both backend and frontend are implemented in TypeScript, ensuring type safety, better tooling, and maintainability across the entire project.
  -  Docker Support: The project includes Docker and Docker Compose configurations for running backend, frontend, and database services in isolated containers.

# Project Setup
Follow these steps to set up and run the project locally or inside Docker:
## Pre-requisites

Before setting up and running the project, make sure the following requirements are met:

- **Docker** – [Install Docker](https://www.docker.com/get-started/)
  > Docker is required for ease of use before proceeding with any other steps. Installation can very from system to system.
  > Alternatively you can use locally installed instance/server of postgresql. But for that you will need to have PostGIS installed. How to install: [link](https://postgis.net/documentation/getting_started/#installing-postgis)
  
- **Node.js and pnpm**
  - **Node.js:** Required to run frontend and backend applications locally. Recommended version: 24+.
  - **pnpm:** Used as the package manager in this project for efficient dependency management. Install it globally:

       `npm install -g pnpm`
 
- **Git**
  - Git is required to clone the repository and manage version control.

# Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Configure environment variables
You need to provide environment variables for different parts of the project.
- Fill the following files:
  - `.env` in the root folder
  - `.env` in the front-end folder
  - `.envs` in the back-end folder
- Use the provided `.env.example` files and inline comments as guidance.
- You can choose arbitrary values for database names, passwords, and other variables, but make sure they are consistent across all files.

### 3. Start Docker services

Run the following command to start all services in detached mode:

`docker compose up -d`

This will spin up the frontend, backend, and database containers.

### 4. Create the database

If you are running PostgreSQL via Docker, the database may already be created automatically. Just dont forget to run compose file.
Otherwise, connect to the PostgreSQL container and create a database with the same name you specified in your `.env` files.

- Connect to the PostgreSQL container started in step 3.
- Create a database with the same name you specified in your `.env` files.
- Use `5432` port for DB.
- Format this url according to your credentianls:
  > `postgresql://<username>:<password>@<host>:<port>/<database>`

> For linux you may need docker compose package installed.

### 5. Run the setup script

- Choose the script according to your system:
  - **Linux/macOS**: `./scripts/setup.sh`
    > You may need to make script executable first: `chmod u+x ./scripts/setup.sh`
  - **Windows PowerShell**: `.\scripts\setup.ps1`
    > Untested. We use linux. (arch btw)

> By default, setup script will setup and build everything for prod trying to use production envs for back-end. (If you have singular .env inside back-end folder setup will be the same for dev/prod modes)

### 6. Start the applications

To run the project in production mode:

`pnpm start`

### 7. For work in dev mode

For local development, you can use:

- You can use `pnpm dev` inside root folder to spin-up **turborepo**
- Use tasks from `.vscode/tasks.json`
  > Google if you dont know how to or you can open different terminals and launch dev scripts from respective folders in them.

# NOTE:

- `packages/common` needs to be build before packages that uses it. Turborepo handles that if you use `build`, `dev` scripts from the root folder. Otherwise build it yourself first and then you can build apps that require this package.
