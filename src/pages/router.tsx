import { createBrowserRouter } from "react-router-dom";
import { Initial } from "./new-playlist";
import { Home } from "./home";
import { SplashLoading } from "./splash-loading/SplashLoading";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashLoading />,
  },
  {
    path: "/initial",
    element: <Initial />,
  },
  {
    path: "/home/:playlistName",
    element: <Home />,
  },
]);