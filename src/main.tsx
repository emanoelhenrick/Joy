import ReactDOM from "react-dom/client";
import './index.css'
import { ThemeProvider } from "./components/theme-provider";
import { RouterProvider } from "react-router-dom";
import { router } from "./pages/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    </ThemeProvider>
  // </React.StrictMode>
);
