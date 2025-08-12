import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React (largest, most stable - good for caching)
          "react-core": ["react", "react-dom"],

          // React Router (changes less frequently)
          router: ["react-router"],

          // React Query (your data fetching layer)
          "react-query": ["@tanstack/react-query"],

          // All Radix UI components (UI primitives - grouping for efficiency)
          "radix-ui": [
            "@radix-ui/react-avatar",
            "@radix-ui/react-dialog",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-select",
            "@radix-ui/react-slot",
          ],

          // Form handling
          forms: ["react-hook-form", "react-select"],

          // Date functionality (react-day-picker pulls in date-fns)
          "date-utils": [
            "react-day-picker",
            // date-fns will be included automatically as dependency
          ],

          // Charts and data visualization
          charts: ["recharts"],

          // Icons (can be large depending on usage)
          icons: ["lucide-react"],

          // Notifications and UI feedback
          notifications: ["react-toastify", "react-error-boundary"],

          // Utility libraries (small but frequently used)
          utils: [
            "clsx",
            "tailwind-merge",
            "class-variance-authority",
            "js-cookie",
            "lodash-es",
          ],
        },
      },
    },
  },

  optimizeDeps: {
    include: [
      // Pre-bundle these for faster dev server startup
      "react",
      "react-dom",
      "@tanstack/react-query",
      "lucide-react",
    ],
    exclude: [
      // Don't pre-bundle these (they might have issues or are dev-only)
      "@radix-ui/react-slot", // Sometimes causes issues in pre-bundling
    ],
  },
});
