# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A collaborative task management app built with Next.js 16, Supabase, Tailwind CSS v4, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript, src directory)
- **Styling:** Tailwind CSS v4, shadcn/ui components
- **Backend:** Supabase (Auth, Postgres, Realtime)
- **Drag & Drop:** @hello-pangea/dnd
- **Theming:** next-themes (system/light/dark)
- **Notifications:** sonner (via shadcn)

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Project Structure

- `src/app/` - Next.js app router pages and layouts
- `src/app/(auth)/` - Login/signup pages (centered layout, no sidebar)
- `src/app/(dashboard)/` - Dashboard and project pages (sidebar layout)
- `src/actions/` - Server actions (auth.ts, projects.ts, tasks.ts)
- `src/hooks/` - Client hooks (use-user.ts, use-realtime-tasks.ts)
- `src/components/ui/` - shadcn/ui components
- `src/components/auth/` - Auth forms
- `src/components/dashboard/` - Sidebar, header, project cards
- `src/components/tasks/` - Kanban board, task cards, dialogs
- `src/components/projects/` - Member list
- `src/lib/supabase/` - Supabase client utilities (client.ts, server.ts, middleware.ts)
- `src/lib/types/` - TypeScript types including database.ts
- `src/middleware.ts` - Auth middleware (redirects unauthenticated users to /login)

## Supabase

- Project ID: `zxbrojgeseprtryxexzn`
- Region: us-east-1
- Environment variables in `.env.local`
- Generated types in `src/lib/types/database.ts` — regenerate with Supabase MCP after schema changes
- Nullable columns (e.g. `position`) need null guards: `(a.position ?? 0)`
- Server action update params: use `Partial<Database['public']['Tables'][table]['Update']>` not `Record<string, unknown>`
- Status/priority params: type as union `'todo' | 'in_progress' | 'done'` not `string`
- After mutations, use `revalidatePath('/', 'layout')` + `router.refresh()` to update both page and layout data
