# Backend Javascript Prisma API Starter Kit

This is a starter kit for building a Node.js API with TypeScript, featuring Prisma ORM, a global error handler, utility functions for standardized error and success responses, and logging with Winston.

## <a name="tech-stack">⚙️ Tech Stack</a>

- [Node.js](https://nodejs.org/en)
- [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Winston](https://github.com/winstonjs/winston) (Logging)

## <a name="features">✨ Features</a>

- **Global Error Handler**: Centralized error handling for consistent error responses.
- **Utility Functions**:
    - `errorHandler`: Standardizes error responses with status codes and messages.
    - `successHandler`: Formats successful responses with data and status codes.
- **Logging**: Winston logger for requests, errors, and application events.
- **Prisma ORM**: Simplified database operations.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/skp544/nodejs-api-ts-starter-kit.git
cd nodejs-api-ts-starter-kit
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Configuration**
To initialize the prisma according to your database, run the following command:

For MongoDB:

```bash
npx prisma init --datasource-provider mongodb
```

For PostgreSQL:

```bash
npx prisma init --datasource-provider postgresql
```

For MySQL:

```bash
npx prisma init --datasource-provider mysql
```

**Database Configuration**
Update the `.env` file with your database connection details.

```env
DATABASE_URL="your_database_connection_string"
```

Make sure to replace `your_database_connection_string` with your actual database connection string.

Additionally, you can set the `PORT` variable to specify the port on which the server will run.

```env
PORT=3000 or any other port you prefer
```

**Running the Project**

```bash
npm run dev
```

This command will start the development server. You can access the API at `http://localhost:3000`.

**Logging**

The project uses Winston for logging. Logs are generated for requests, errors, and application events, stored in the logs/ directory. Configure logging in src/utils/logger.ts.

## 🚀 Usage

- **Global Error Handler**: Catches unhandled errors and formats them using errorHandler.
- **Error Handler Utility**: Use errorHandler(statusCode, message) for standardized error responses.
- **Success Handler Utility**: Use successHandler(res, statusCode, data, message) for standardized success responses.
- **Logging**: Winston logs to console and files. Customize in src/utils/logger.ts.

<a name="scripts">📜 Available Scripts</a>

- `npm run dev` - 
Starts the development server with live-reloading using Node’s `--watch` flag.
  The server restarts automatically when you make changes in `src/`.
- `npm run start` - Runs the server in production mode without watching for changes.
- `npm run lint` - Runs ESLint to analyze code for potential issues and enforce coding standards.
- `npm run lint:fix` - Runs ESLint and automatically fixes fixable issues.
- `npm run format` - Runs Prettier to automatically format the codebase.
- `npm run format:check` - Runs Prettier in check mode to verify if code is properly formatted (without modifying files).
- `npm run db:generate` - Generates the Prisma client based on the schema defined in `prisma/schema.prisma`.
- `npm run db:push` - Pushes your Prisma schema state to the database without generating a migration.
  Useful for prototyping or quick schema changes.
- `npm run db:pull` - Pulls the database schema into your local Prisma schema file (`schema.prisma`).
  Useful when working with an existing database.

