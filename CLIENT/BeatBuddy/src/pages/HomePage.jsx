import Swal from "sweetalert2";
import { MainContent } from "../components/MainContent";
import { Nav } from "../components/Nav";
import { SideLeft } from "../components/SideLeft";
import { SideRight } from "../components/SideRight";
import { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

export default function HomePage() {
  const [token, setToken] = useState("");
  const [searchParams] = useSearchParams();

  const validateToken = async () => {
    try {
      const tokenFromParams = searchParams.get("spotify_token");
      const accessTokenFromParams = searchParams.get("access_token");
      if (tokenFromParams) {
        setToken(tokenFromParams);
        localStorage.setItem("spotifyToken", tokenFromParams);
        localStorage.setItem("access_token", accessTokenFromParams);
      }
    } catch (error) {
      Swal.fire({
        title: error.response?.data.error,
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `
      });
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-700">
      <Nav />
      <div className="flex flex-1 overflow-hidden">
        <SideLeft />
        <main className="flex-1 overflow-y-auto p-4 shadow-inner">
          <Outlet />
        </main>
        <SideRight />
      </div>
    </div>
  );
}
