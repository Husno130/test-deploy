Render deployment notes

This file explains the minimal steps to deploy the project to Render (backend, frontend, and a cron job).

1) Push repository to GitHub
   - Ensure your code is on a branch (e.g., `main`)

2) Backend (web service)
   - In Render, create a new Web Service and connect your repo.
   - Set the **Root Directory** to `backend`.
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Environment variables (set in Render Dashboard -> Environment):
     - `MONGODB_URI` — MongoDB connection string
     - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_FROM`, `EMAIL_USE_TLS`
     - `GEMINI_API_KEY` (or any AI provider key)
     - Any other secrets used by your app

3) Frontend (static site)
   - In Render, create a new Static Site and connect your repo.
   - Set the **Root Directory** to `frontend`.
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - IMPORTANT: Add an environment variable `VITE_API` with the backend public URL (e.g., `https://api.example.com`) before triggering a new deploy. Vite reads `import.meta.env.VITE_API` at build time.

4) Cron job (inactive-scan)
   - In Render, create a Cron Job.
   - Schedule: daily at 02:00 (UTC) => `0 2 * * *`
   - Command: `bash -lc "cd backend && python3 scripts/run_inactive_scan.py"`
   - Set the same environment variables (at least `MONGODB_URI` and any API keys) for the job.

5) Notes & troubleshooting
   - HTTP vs HTTPS: ensure `VITE_API` uses `https://` when frontend served over HTTPS.
   - If you change `VITE_API`, you need to redeploy the frontend so the built JS picks up the new value.
   - Monitor backend logs in Render for any runtime errors from the AI or email provider.

6) Optional: render.yaml
   - A `render.yaml` was added to the repository as an example manifest. You can use it to create services via Render's "Create from file" feature, or configure via UI.

If you want, I can also:
- Add a small health-check endpoint for the frontend to verify backend connectivity.
- Add a `Procfile` or Dockerfile for more control.
