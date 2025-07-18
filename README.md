# FlavorAI - Backend API

This is the server side of the FlavorAI project, a personalized platform for finding and managing recipes. The API is built on Node.js and Express.js, using TypeScript for typing and Prisma ORM to work with the PostgreSQL database.

## Technologies

- **Node.js** - Runtime environment JavaScript.
- **Express.js** - A web framework for creating API.
- **TypeScript** - Typical superstructure over the JavaScript.
- **PostgreSQL** - Object-relational database management system.
- **Prisma** - New generation ORM for working with the database.
- **JWT (JSON Web Tokens)** - For authentication and authorization.
- **Bcrypt** - For password hashing.

## Installation and startup

### Background

Before you start, make sure you have installed:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Instructions

1.  **Clone the repository:**

    ```bash
    git clone <URL of your repository>
    cd personalRecipeBack
    ```

2.  **Setup deps:**

    ```bash
    npm install
    ```

3.  **Customize env variables:**

    - Create the `.env` file in the project root by copying `example.env` (if you create it) or manually.
    - Add the following variables to `.env`:

    ```env
    # Connection with the database PostgreSQL
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

    # Secret key for signature JWT
    JWT_SECRET="yourkey"
    ```

    Replace `USER`, `PASSWORD`, `HOST`, `PORT` та `DATABASE` with your real data.

4.  **Create a database:**
    Using `pgAdmin` r another tool, create a PostgreSQL database with the name you specified in `DATABASE_URL`.

5.  **Apply database migrations:**
    This command will create tables in your database according to the Prisma schema.
    ```bash
    npx prisma migrate dev
    ```

### Starting the server

- **In development mode (with automatic restart):**

  ```bash
  npm run dev
  ```

  The server will be available at `http://localhost:3000`.

- **In production mode:**
  ```bash
  npm run build
  npm start
  ```

## Endpoints API

### Authentication (`/api/auth`)

| Method | Route       | Description                  | Protection    |
| :----- | :---------- | :--------------------------- | :------------ |
| `POST` | `/register` | Registering a new user.      | Public        |
| `POST` | `/login`    | User login, receiving JWT.   | Public        |
| `GET`  | `/me`       | Get the current user's data. | **JWT Token** |

### Recipes (`/api/recipes`)

| Method   | Route  | Description                       | Protection    |
| :------- | :----- | :-------------------------------- | :------------ |
| `GET`    | `/`    | Get a list of all recipes.        | Public        |
| `GET`    | `/:id` | Receiving one prescription by ID. | Public        |
| `POST`   | `/`    | Create a new recipe.              | **JWT Token** |
| `PUT`    | `/:id` | Update recipe by ID.              | **JWT Token** |
| `DELETE` | `/:id` | Delete recipe by ID.              | **JWT Token** |

---
