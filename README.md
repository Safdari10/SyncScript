# SyncScript

SyncScript is a fullstack collaborative text editor built with [Next.js](https://nextjs.org), [Prisma](https://www.prisma.io/), and [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API). It supports real-time collaborative editing, document version history, and persistent storage with PostgreSQL.

## Features

- Real-time collaborative editing using Operational Transformation (OT) and WebSockets
- Automatic document persistence and version snapshots
- View version history and restore previous versions
- Modular React hooks and utilities for clean code
- PostgreSQL database with Prisma ORM

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Start the Database

Start the local Postgres database with Docker:

```sh
docker-compose up -d
```

### 3. Set Up the Database

Run Prisma migrations to set up the schema:

```sh
npm run migrate
# or
npx prisma migrate dev
```

### 4. Run the Backend (WebSocket Server)

In a separate terminal, start the collaborative backend:

```sh
npm run ws
# or
npx tsx src/server/websocket.ts
```

### 5. Run the Frontend (Next.js App)

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the app.

## Project Structure

- `src/components/Editor.tsx` – Main collaborative editor component
- `src/components/VersionHistory.tsx` – View document version history
- `src/hooks/useDocumentWebSocket.ts` – Custom hook for WebSocket connection
- `src/hooks/useDocumentChangeHandler.ts` – Custom hook for handling editor changes
- `src/lib/websocket.ts` – WebSocket client utilities
- `src/server/websocket.ts` – WebSocket server logic
- `src/types/types.ts` – Shared TypeScript types

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [WebSockets Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
