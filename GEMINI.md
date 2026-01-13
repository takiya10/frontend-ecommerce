# Project Context: E-commerce Frontend

## Project Overview
This is a modern frontend web application designed for an e-commerce platform. It is built using **React** with **Vite** as the build tool and **TypeScript** for type safety. The UI is styled with **Tailwind CSS** and leverages **Shadcn UI** (Radix UI) components for a polished, accessible design.

## Tech Stack
*   **Framework:** React 19.2
*   **Build Tool:** Vite 5.4
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Tailwind Merge, Tailwind Animate
*   **UI Components:** Shadcn UI (Radix UI primitives), Lucide React (icons)
*   **Routing:** React Router DOM v6
*   **State Management / Data Fetching:** TanStack React Query v5
*   **Forms:** React Hook Form + Zod
*   **Animations:** Framer Motion

## Project Structure
*   `src/App.tsx`: Main application component containing the route definitions.
*   `src/main.tsx`: Entry point rendering the App.
*   `src/pages/`: Contains page components corresponding to routes (e.g., `Index.tsx`, `ProductDetail.tsx`, `Cart.tsx`).
*   `src/components/`:
    *   `ui/`: Reusable UI components (buttons, inputs, dialogs) derived from Shadcn UI.
    *   `layout/`: Layout components like `Header.tsx` and `Footer.tsx`.
    *   `home/`, `product/`: Feature-specific components.
*   `src/hooks/`: Custom React hooks (e.g., `use-toast.ts`, `use-mobile.tsx`).
*   `src/lib/`: Utility functions (e.g., `utils.ts` for Tailwind class merging).
*   `public/`: Static assets.

## Key Commands
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server (default port 8080). |
| `npm run build` | Builds the application for production. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

## Development Conventions
*   **Styling:** Use Tailwind CSS utility classes. The project uses a custom theme (fashion-oriented colors like `cream`, `taupe`, `dusty-pink`) defined in `tailwind.config.ts`.
*   **Components:** Prefer using existing Shadcn UI components in `src/components/ui` before creating new primitive components.
*   **Imports:** Use the `@` alias to resolve paths relative to `src` (e.g., `import { Button } from "@/components/ui/button"`).
*   **Routing:** Add new routes in `src/App.tsx` inside the `<Routes>` component.
*   **Data Fetching:** Use `TanStack Query` for managing server state.
*   **Forms:** Use `react-hook-form` combined with `zod` schema validation.

## Configuration
*   **Vite:** `vite.config.ts` - configured with `@` alias and React plugin.
*   **Tailwind:** `tailwind.config.ts` - includes custom colors, fonts ("Cormorant Garamond", "Plus Jakarta Sans"), and animations.
*   **TypeScript:** `tsconfig.json` and `tsconfig.app.json`.
