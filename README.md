# Planova Server 🚀

Welcome to the backend repository of **Planova**, a comprehensive event management platform. This project serves as the robust and scalable server-side architecture powering the Planova web application.

Built with modern backend technologies, it ensures superior performance, type safety, and efficient data handling.

---

## 🔗 Live URLs

- **Live Application**: [https://planova-client.vercel.app]
- **Live Backend**: [https://planova-server-lake.vercel.app]

- **Frontend Repository**: [https://github.com/mdrifatul/Planova_Client]
- **Backend Repository**: [https://github.com/mdrifatul/Planova_server]

---

## 🛠️ Technology Stack

The Planova Server leverages the following modern tools and frameworks:

- **Runtime & Framework Base:** Node.js, Express.js
- **Language:** TypeScript for end-to-end type safety, resulting in predictable and robust code.
- **Database & ORM:** PostgreSQL managed via [Prisma ORM](https://www.prisma.io/).
- **Authentication:** [Better Auth](https://better-auth.com/) for secure, comprehensive session & user management (including OAuth support).
- **Payment Processing:** [Stripe](https://stripe.com/) integration for payments and webhook handling.
- **Validation:** Zod for rigorous runtime schema validation.
- **Mailing:** Nodemailer for transactional email delivery.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/) (v25+ recommended)
- [pnpm](https://pnpm.io/) (v10+ recommended)
- A running instance of PostgreSQL.

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd planova_server
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   Duplicate the `.env.example` file and rename it to `.env`. Fill in the required values.

   ```bash
   cp .env.example .env
   ```

   _Note: Ensure you provide valid credentials for PostgreSQL, Stripe, Better Auth, and your Email Service provider._

4. **Database Migration & Initialization:**
   Generate the Prisma Client and run migrations to structure your database:

   ```bash
   pnpm generate
   pnpm push    # Or `pnpm migrate` to run complete dev migrations
   ```

5. **Start the Development Server:**
   ```bash
   pnpm dev
   ```
   The server will start running, usually at `http://localhost:5000` (depending on your `.env` `PORT` configuration).

---

## 📜 Available Scripts

In the project directory, you can run the following commands:

| Command               | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `pnpm dev`            | Runs the server in development mode with live reloading using `tsx`.   |
| `pnpm build`          | Compiles the TypeScript code into production-ready JavaScript code.    |
| `pnpm start`          | Starts the production server from the compiled `dist/server.js` file.  |
| `pnpm generate`       | Generates the static Prisma client based on your schema.               |
| `pnpm migrate`        | Applies existing migrations to the database.                           |
| `pnpm studio`         | Opens Prisma Studio to visually inspect and modify your database data. |
| `pnpm lint`           | Lints the codebase using ESLint to enforce best practices.             |
| `pnpm stripe:webhook` | Listens for Stripe webhook events locally (requires Stripe CLI).       |

---

## 🏗️ Project Structure

```
planova_server/
├── prisma/             # Prisma schema and configuration files
├── scripts/            # Utility build/maintenance scripts
├── src/
│   ├── app/            # Application logic, routes, and controllers
│   ├── server.ts       # Application entry point
│   └── ...
├── .env.example        # Environment variable template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vercel.json         # Vercel deployment configuration
```

---

## 🔐 Environment Variables

The project relies heavily on environment variables for secure configuration. Refer to the `.env.example` file for the complete list of required keys, which include configurations for:

- Database connectivity (`DATABASE_URL`)
- Authentication secrets (`BETTER_AUTH_SECRET`, JWT keys)
- Third-party integrations (Stripe, Google OAuth, Cloudinary)
- Email SMTP configurations

---
