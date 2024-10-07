import ReactDOM from "react-dom/client";
import './index.css'
import { ThemeProvider } from "./components/theme-provider";
import { RouterProvider } from "react-router-dom";
import { router } from "./pages/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
    </ThemeProvider>
  // </React.StrictMode>
);
