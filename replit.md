# LandFlow - Landing Page & Email Marketing Platform

## Project Overview
This is a full-stack marketing automation platform migrated from Lovable to Replit. It provides landing page creation, email campaigns, lead management, and analytics features.

## Recent Changes (October 22, 2025)
- Migrated project structure from Lovable to Replit full-stack template
- Moved all frontend files from `src/` to `client/src/`
- Created backend server with Express in `server/` directory
- Converted routing from react-router-dom to wouter
- Set up shared types in `shared/schema.ts`
- Configured full-stack development environment

## Project Structure
```
/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utility functions
│   │   └── hooks/       # Custom React hooks
│   ├── public/          # Static assets
│   └── index.html       # HTML entry point
├── server/              # Backend Express server
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data storage layer
│   └── vite.ts          # Vite dev server setup
├── shared/              # Shared types/schemas
│   └── schema.ts        # Data models
└── package.json         # Dependencies and scripts
```

## Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Routing**: wouter (migrated from react-router-dom)
- **Backend**: Express + TypeScript
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod validation

## Development
```bash
npm run dev    # Start development server on port 5000
npm run build  # Build for production
npm run start  # Run production build
```

## Current Migration Status
The project has been successfully migrated to the Replit full-stack structure. The server is configured to run on port 5000 and serve both the API and the frontend.

## Known Issues
- tsx watch is experiencing esbuild deadlocks during file watching - investigating server startup
- All routing has been migrated to wouter but may need testing

## User Preferences
- Keep `.local/state/replit/agent/progress_tracker.md` updated with [x] markers for completed items
