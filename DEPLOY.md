# Maple Avatar Studio Deployment

## Local run

Open two terminals.

Terminal 1:

```bash
cd server
npm install
npm run dev
```

Terminal 2:

```bash
cd client
npm install
npm run dev
```

Then open the Vite URL, usually `http://localhost:5173`.

## Backend deploy

Deploy the `server` folder to a Node hosting service such as Render or Railway.

Recommended settings:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `NEXON_API_KEY`
  - `ALLOWED_ORIGINS=https://your-vercel-app.vercel.app`

After deploy, confirm this URL returns JSON:

```text
https://your-backend-url/
```

## Frontend deploy to Vercel

Import the repository in Vercel and use these settings:

- Root directory: `client`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Add this Vercel environment variable:

```text
VITE_API_BASE_URL=https://your-backend-url
```

Redeploy after adding the environment variable.

The frontend includes `client/vercel.json`, so paths such as `/landing` will load the React app instead of returning a Vercel 404.

## Important

Do not commit real `.env` files or API keys. If a key was pushed or shared, rotate it in the Nexon developer console.

The production server does not expose `/api/debug/env`; keep API key checks in hosting logs only.
