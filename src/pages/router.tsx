import { createBrowserRouter } from "react-router-dom";
import { Initial } from "./new-playlist";
import { VodDashboard } from "./dashboards/vod-dashboard";
import { SplashLoading } from "./splash-loading/SplashLoading";
import { SeriesDashboard } from "./dashboards/series-dashboard";
import { LiveDashboard } from "./dashboards/live-dashboard";

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
    path: "/vod-dashboard/:playlistName",
    element: <VodDashboard />,
  },
  {
    path: "/series-dashboard/:playlistName",
    element: <SeriesDashboard />,
  },
  {
    path: "/live-dashboard/:playlistName",
    element: <LiveDashboard />,
  },
]);