"use client";
import { api } from "../api";
import { Sidebar } from "flowbite-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export function SideLeft() {
  let [greet, setGreet] = useState("");

  const getGreet = async () => {
    try {
      const response = await api.get("/gemini");
      setGreet(response.data);
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
        `,
      });
    }
  };

  useEffect(() => {
    getGreet();
  }, []);

  return (
    <Sidebar
      className="h-full"
      theme={{
        root: {
          inner:
            "h-full overflow-y-auto overflow-x-hidden bg-gray-50 py-4 px-3 dark:bg-gray-800",
        },
      }}
    >
      <div className="p-4">
        <h1 className="font-bold text-xl text-center mb-2 dark:text-gray-100">
          Gemini AI
        </h1>
        <p className="text-justify text-sm dark:text-gray-100">
          {greet && greet}
        </p>
      </div>
    </Sidebar>
  );
}
