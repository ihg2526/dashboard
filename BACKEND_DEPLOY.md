# Backend Deployment Guide (Render.com)

This guide explains how to deploy your secure backend to the cloud so you can manage your scoreboard from anywhere.

## 1. Prerequisites
- A GitHub account (you already have this).
- A [Render.com](https://render.com) account (Sign up with GitHub).

## 2. Deploy Backend to Render
1.  **Push your latest code** to GitHub:
    ```bash
    git add .
    git commit -m "Prepare backend for deployment"
    git push
    ```
2.  Log in to **RenderDashboard**.
3.  Click **New +** -> **Web Service**.
4.  Select **Build and deploy from a Git repository**.
5.  Connect your `score` repository.
6.  **Configure the Service**:
    -   **Name**: `score-backend` (or similar)
    -   **Region**: Closest to you (e.g., Singapore, Oregon).
    -   **Branch**: `main`
    -   **Root Directory**: `.` (leave empty)
    -   **Runtime**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `node backend/server.js`
    -   **Instance Type**: Free

7.  **Environment Variables** (Scroll down to "Advanced" or "Environment"):
    Add the following variables:
    -   `NODE_VERSION`: `18.17.0` (or `18.x`)
    -   `ADMIN_PASSWORD`: Your secret password for the Admin Panel.
    -   `JWT_SECRET`: A long random string (e.g., `sadf897sadf87safd`).

8.  Click **Create Web Service**.
9.  Wait for the build to finish. Once live, copy your backend URL (e.g., `https://score-backend.onrender.com`).

## 3. Connect Frontend to Backend
Now tell your frontend where the live backend is.

1.  Go to your GitHub Repository > **Settings** > **Secrets and variables** > **Actions**.
2.  Click **New repository secret**.
3.  **Name**: `VITE_API_URL`
4.  **Value**: Your Render Backend URL (e.g., `https://score-backend.onrender.com`) **(No trailing slash)**.
5.  Click **Add secret**.

## 4. Re-deploy Frontend
To apply the new connection:
1.  Go to the **Actions** tab in GitHub.
2.  Select your **Publish** workflow (or just push a small change to `README.md` to trigger it).
3.  Wait for the deployment to finish.

## 5. Verify
1.  Go to your live site: `https://ihg2526.github.io/dashboard/`
2.  Navigate to `/login` (or click the hidden link if you hid it).
3.  Login with your `ADMIN_PASSWORD`.
4.  Try updating a score or uploading a form.
    -   *Note: On the free tier of Render, uploaded files and data changes might disappear if the server restarts (approx every 15 mins of inactivity). For permanent storage, you would need a persistent disk (Paid) or an external database (MongoDB).*

## Troubleshooting
-   **Login Fails**: Check if `VITE_API_URL` is set correctly in GitHub Secrets and if the frontend was re-deployed.
-   **CORS Error**: If you see CORS errors in the console, we might need to update the `allowedOrigins` in `backend/server.js` to explicitly match your GitHub domain.
