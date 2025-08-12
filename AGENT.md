# Nich Drugs - Point of Sale System

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (includes TypeScript check)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- No test commands configured

## Architecture
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **State Management**: TanStack Query for server state, React Context for global state
- **Routing**: React Router v7
- **Storage**: IndexedDB for offline support, js-cookie for auth tokens
- **API**: REST API client with authentication, offline sync capabilities
- **Pages**: Dashboard, POS Terminal, Sales, Products, Inventory, Shops, Users, Categories

## Code Style
- **Components**: PascalCase files (e.g., TotalSales.tsx), functional components with hooks
- **Imports**: Group external libraries first, then internal imports (api, hooks, utils, components)
- **Types**: TypeScript interfaces in `src/utils/types.ts`, use `type` for union types
- **Hooks**: Custom hooks in `src/customHooks/`, prefix with `use`
- **API**: Centralized in `src/api/`, uses class-based ApiClient with methods (get, post, etc.)
- **State**: TanStack Query mutations for API calls, React Context for shop state
- **Naming**: camelCase for variables/functions, kebab-case for file paths
- **Error Handling**: Toast notifications via react-toastify, try-catch in API layer
