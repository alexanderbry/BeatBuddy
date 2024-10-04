import { createBrowserRouter, redirect } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SpotifyPage from "./pages/SpotifyPage";
import { MainContent } from "./components/MainContent";
import Profile from "./components/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "",
        element: <MainContent />,
      },
      {
        path: ":ProfileId",
        element: <Profile />,
      },
    ]
  },
  {
    path: "/login",
    loader: () => {
      const accessToken = localStorage.getItem("access_token");
      const spotifyToken = localStorage.getItem("spotifyToken");

      if(accessToken && !spotifyToken) {
        return redirect("/spotify");
      }
      if (accessToken || spotifyToken) {
        return redirect("/");
      }
      return null;
    },
    element: <LoginPage />,
  },
  {
    path: "/register",
    loader: () => {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        return redirect("/");
      }
      return null;
    },
    element: <RegisterPage />,
  },
  {
    path: "/spotify",
    loader: () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        return redirect("/login");
      }
      return null;
    },
    element: <SpotifyPage />,
  },
]);
