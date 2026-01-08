# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Node.js/Express backend for the Unipivot static website (Korean youth cooperation organization). Handles form submissions via API endpoints. The frontend is served by Nginx from the parent directory.

## Commands

```bash
# Install dependencies
npm install

# Start server (port 3010)
npm start

# Or directly
node server.js

# PM2 management (production)
pm2 restart unipivot
pm2 logs unipivot
```

## Architecture

### Server (`server.js`)
- Express 5.x with CORS, body-parser middleware
- Serves static files from parent directory (`/home/jit/unipivot/`)
- API endpoints at `/api/*` proxied from Nginx

### API Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/request` | POST | General inquiry form |
| `/api/donate` | POST | Donation form |
| `/api/contact` | POST | Contact form |
| `/api/form` | POST | Generic form handler |

All form handlers are stubs that log requests - email/database logic not implemented.

### Nginx Integration
- Config: `/etc/nginx/sites-available/unipivot.iotok.org`
- Project config: `../nginx-unipivot.iotok.org.conf`
- `/api/*` routes proxied to `127.0.0.1:3010`
- After config changes: `sudo cp ../nginx-unipivot.iotok.org.conf /etc/nginx/sites-available/unipivot.iotok.org && sudo nginx -t && sudo systemctl reload nginx`

## Key Notes

- Port: 3010 (configurable via `PORT` env var)
- Parent directory contains static HTML/CSS/JS from cloned IMWEB website
- IMWEB platform JS has been disabled/stubbed (TOKEN functions in `../assets/vendor-cdn/js/common.js`)
- Nodemailer installed but not configured
