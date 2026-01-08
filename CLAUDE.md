# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website clone of unipivot.org (Korean cultural/social organization for North-South Korea youth cooperation) with a Node.js/Express backend for form handling.

- **Original source**: https://www.unipivot.org/ (hosted on IMWEB platform)
- **Language**: Korean (한국어)
- **Stack**: HTML/CSS/JS frontend, Node.js/Express backend

## Common Commands

```bash
# Backend server (runs on port 3010)
cd backend && npm install
cd backend && npm start        # or: node server.js

# No build step - static HTML files served directly
# No test suite configured
```

## Architecture

### Backend (`/backend/`)
- `server.js` - Express server with CORS, body-parser
- API endpoints: `/api/request`, `/api/donate`, `/api/contact`, `/api/form`, `/api/health`
- Form handlers are stubs - TODO: implement actual email/database logic

### Frontend (root directory)
- Static HTML pages: `index.html`, `about.html`, `board.html`, `donate.html`, `reviews.html`, `seminar.html`, etc.
- Content directories: `bookclub_offline/`, `bookclub_olinen/`, `kmove/`, `reviews/`, `seminar/`, `opinion/`
- Assets in `/assets/cdn/` (images from original IMWEB CDN)
- Custom CSS in `/css/`, JS in `/js/`

### Key Technical Details
- Port: 3010 (configurable via `process.env.PORT`)
- Brand color: #06bfb9 (teal)
- Fonts: KoPub Dotum, Nanum Gothic, Pretendard
- Forms submit to backend API at `localhost:3010/api/*`

## Development Notes

- This is a cloned website - many URLs reference the original imweb.me CDN
- Large static assets (~295MB in `/assets/`)
- Not a git repository
- `cloneplan_unipivot.yaml` contains the original cloning/deployment plan
