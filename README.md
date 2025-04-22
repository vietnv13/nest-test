# NestJS Project

## Introduction

This project is built using the NestJS framework, designed for building efficient and scalable server-side applications. It leverages modern technologies and best practices, including:

- Node.js >=22
- pnpm >=9 (for fast, disk-efficient package management)
- SWC (for super-fast TypeScript transpilation)
- Fastify (as the HTTP adapter for high performance)
- TypeORM (for ORM with support for advanced features)
- PostgreSQL (as the relational database)

## Installation

1. Start Dependencies via Docker

   Make sure you have docker and docker-compose installed:
   `docker-compose up -d`

2. Install Node.js Dependencies

   Make sure you have pnpm installed:
   `pnpm install`

3. Build and Development

   `pnpm dev` Start app in development mode

   `pnpm build` Compile project using Nest CLI

   `pnpm start` Start app with NODE_ENV=development

   `pnpm start:prod` Start compiled app with NODE_ENV=production

4. Code Quality

   `pnpm lint` Run ESLint to find issues

   `pnpm lint:fix` Auto-fix lint issues

   `pnpm format` Format code using Prettier

5. Migrations (TypeORM)

   `pnpm migration:generate` Generate a migration file using current entities

   `pnpm migration:run` Run all pending migrations

   `pnpm migration:revert` Revert the last executed migration

   Note: Make sure to set the environment variables or use .env files for DB connection before running migrations.

6. Test
   `pnpm test` Run all test cases
