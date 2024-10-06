import { createBrowserRouter } from "react-router-dom";
import { Initial } from "./new-playlist";
import { Home } from "./home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Initial />,
  },
  {
    path: "/home/:playlistName",
    element: <Home />,
  },
]);