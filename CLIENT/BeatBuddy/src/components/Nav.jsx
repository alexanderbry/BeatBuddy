"use client";

import { Avatar, DarkThemeToggle, Dropdown, Navbar } from "flowbite-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Loading from "./Loading";
import { findUser } from "../redux/storeSpotify";
import Swal from "sweetalert2";

export function Nav() {
  const { currentUser, isLoading, isError } = useSelector(
    (state) => state.spotify
  );
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.clear();
      navigate("/login");
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
    dispatch(findUser());
  }, []);

  return (
    <>
      {!isLoading ? (
        <Navbar
          fluid
          theme={{
            root: {
              base: "bg-gray-50 px-2 pt-2 z-20 dark:border-gray-700 h-16 w-screen items-center dark:bg-gray-800 sm:px-4",
              rounded: {
                on: "rounded",
                off: "",
              },
            },
          }}
        >
          <Navbar.Brand href="/">
            <span className="mx-5 self-center whitespace-nowrap text-2xl font-semibold dark:text-white hover:text-green-500"></span>
          </Navbar.Brand>
          <div className="flex md:order-2 gap-5">
            {currentUser.id ? (
              <>
                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <Avatar
                      alt="User settings"
                      img={
                        currentUser.images
                          ? currentUser.images[0].url
                          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                      }
                      rounded
                    />
                  }
                >
                  <Dropdown.Header>
                    <span className="block text-sm font-medium">
                      Hi,{" "}
                      <span className="font-bold">
                        {currentUser.display_name}
                      </span>
                      !
                    </span>
                    <span className="block truncate text-xs">
                      {currentUser.email}
                    </span>
                  </Dropdown.Header>
                  <Dropdown.Item>
                    <Link to={`/${currentUser.id}`}>See Profile</Link>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
                </Dropdown>
              </>
            ) : (
              <a
                href="/login"
                className="flex text-center items-center text-green-500"
              >
                Log In / Connect Spotify
              </a>
            )}
            <Navbar.Toggle />
            <DarkThemeToggle />
          </div>
          <Navbar.Collapse>
            <Link
              to={"/"}
              className="mx-5 self-center whitespace-nowrap text-2xl font-semibold dark:text-white hover:text-green-500"
            >
              BeatBuddy
            </Link>
          </Navbar.Collapse>
        </Navbar>
      ) : (
        <Loading />
      )}
    </>
  );
}
