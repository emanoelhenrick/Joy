import { createHashRouter, createRoutesFromElements, Outlet, Route } from "react-router-dom";
import { Initial } from "./new-playlist";
import { VodDashboard } from "./vod/VodDashboard";
import { SplashLoading } from "./splash-loading/SplashLoading";
import { SeriesDashboard } from "./series/SeriesDashboard";
import { LiveDashboard } from "./live/LiveDashboard";
import { MenuBar } from "@/components/menubar/MenuBar";
import { HomeDashboard } from "./home/HomeDashboard";

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" Component={SplashLoading} />
      <Route path="/initial" Component={Initial} />
      <Route path="/dashboard" element={
        <div className="flex">
          <MenuBar />
          <Outlet />
        </div>
        }
      >
        <Route path="/dashboard/home/:playlistName" Component={HomeDashboard} />
        <Route path="/dashboard/vod/:playlistName" Component={VodDashboard} />
        <Route path="/dashboard/series/:playlistName" Component={SeriesDashboard} />
        <Route path="/dashboard/live/:playlistName" Component={LiveDashboard} />
      </Route>
    </>

  )
  );