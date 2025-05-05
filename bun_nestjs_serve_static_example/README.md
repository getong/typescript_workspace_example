# NestJS Serve Static Example with Bun

This project demonstrates how to serve static files with NestJS running on Bun.

## Features

- Serves static files from the `public` directory
- Uses Bun as the JavaScript runtime
- NestJS for the server framework
- Custom Express middleware for static file serving
- Handles URLs with or without trailing slashes
- Excludes API routes from static file handling

## Installation

```bash
bun install
```

## Running the app

```bash
# development
bun run dev

# production
bun start
```

## How it works

- The application uses a custom middleware to serve files from the `public` directory.
- Static files are available at the root URL (e.g., http://localhost:3000/).
- The middleware handles:
  - Trailing slashes in URLs (e.g., `/about.html/`).
  - Serving `index.html` for directory paths without extensions.
- API routes (e.g., `/api/health`) are excluded from static file handling.

## Accessing pages

- Homepage: http://localhost:3000/
- About page: http://localhost:3000/about.html (with or without trailing slash)

## Directory Structure
