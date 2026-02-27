# Project structure

- `apps/*` - applications itself, client and server
- `packages/*` - "libs" or "shared packages" with re-usable code
  > Useful utils snippets can be stored there if you plan on re-use them accross applications. Also types for API responses/requests will be stored there to make it easier and less "copy-paste".

# Project stack

- Back-end:
  - NestJS as main framework, drizzle-orm
- Front-end:
  - WIP
- General:
  - Everything in TypeScript.

# Project Setup

## Pre-requisites

- **Docker** – [Install Docker](https://www.docker.com/get-started/)
  > Docker is required for ease of use before proceeding with any other steps. Installation can very from system to system.
  > Alternatively you can use locally installed instance/server of postgresql. But for that you will need to have PostGIS installed. How to install: [link](https://postgis.net/documentation/getting_started/#installing-postgis)

# Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Configure environment variables

- Fill the following files:
  - `.env` in the root folder
  - `.env` in the front-end folder
  - `.envs` in the back-end folder
- Use `.env.example` and the comments inside for guidance.
- You can use arbitrary values for database names, passwords, and other variables.

### 3. Start Docker services

`docker compose up -d`

### 4. Create the database

- Connect to the PostgreSQL container started in step 3.
- Create a database with the same name you specified in your `.env` files.
- Use `5432` port for DB.
- Format this url according to your credentianls:
  > `postgresql://<username>:<password>@<host>:<port>/<database>`

> If using Docker this step might be unnecessary. Just dont forget to run compose file. For linux you may need docker compose package installed.

### 5. Run the setup script

- Choose the script according to your system:
  - **Linux/macOS**: `./scripts/setup.sh`
    > You may need to make script executable first: `chmod u+x ./scripts/setup.sh`
  - **Windows PowerShell**: `.\scripts\setup.ps1`
    > Untested. We use linux. (arch btw)

> By default, setup script will setup and build everything for prod trying to use production envs for back-end. (If you have singular .env inside back-end folder setup will be the same for dev/prod modes)

### 6. Start the applications

`pnpm start`

### 7. For work in dev mode

- You can use `pnpm dev` inside root folder to spin-up **turborepo**
- Use tasks from `.vscode/tasks.json`
  > Google if you dont know how to or you can open different terminals and launch dev scripts from respective folders in them.

# NOTE:

- `packages/common` needs to be build before packages that uses it. Turborepo handles that if you use `build`, `dev` scripts from the root folder. Otherwise build it yourself first and then you can build apps that require this package.
