import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/student-employer-connect/", 
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
// This configuration sets up a Vite project with React and SWC, includes a component tagger for development mode, and resolves aliases for easier imports. The base path is set to "/student-employer-connect/" to ensure correct asset loading in production. The server is configured to listen on all interfaces at port 8080.
// The `componentTagger` plugin is conditionally included only in development mode to enhance the development experience by tagging components for easier identification and debugging. The `resolve.alias` configuration allows for cleaner import statements throughout the project, making it easier to manage paths to components and utilities.
// The `base` option is set to ensure that the application can be correctly served from a subdirectory when deployed, which is particularly useful for GitHub Pages or similar hosting solutions. This configuration is tailored for a React application that may be deployed in a specific path rather than the root of the domain.
// The `server` configuration allows the development server to be accessed from any network interface, which is useful for testing on different devices within the same network. The specified port (8080) can be adjusted based on your preferences or requirements.
// The use of `defineConfig` from Vite helps in providing type safety and better IntelliSense support in IDEs, making it easier to manage the configuration options. The overall setup is designed to streamline the development process while ensuring compatibility with various deployment scenarios.