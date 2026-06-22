# Dual Craft — Frontend

React + TypeScript + Vite frontend for the Dual Craft agency website.

## Stack

- **React 19** + **TypeScript**
- **Vite 8** — build tool
- **TailwindCSS 4** — styling
- **GSAP 3** + **Lenis** — animations and smooth scrolling
- **Axios** — API client with JWT interceptors
- **React Router v6** — client-side routing
- **react-markdown** + **rehype-highlight** — blog post rendering

## Dev Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create a `frontend/.env` file:

```env
VITE_API_URL=http://localhost:8000/api
```

In production set `VITE_API_URL` to your deployed backend URL.

## Build

```bash
npm run build
```

Output is in `dist/`. The `vercel.json` in this folder configures SPA routing rewrites so React Router works correctly on Vercel.
