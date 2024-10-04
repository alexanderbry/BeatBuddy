"use client";

import { Sidebar } from "flowbite-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSeveralTracks } from "../redux/storeSpotify";
import Loading from "./Loading";

export function SideRight() {
  const { tracks, isLoading } = useSelector((state) => state.spotify);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSeveralTracks());
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Sidebar
          className="h-full"
          theme={{
            root: {
              inner:
                "h-full overflow-y-auto overflow-x-hidden bg-gray-50 py-4 px-3 dark:bg-gray-800",
            },
            item: {
              base: "flex items-center justify-end rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
            },
          }}
        >
          <Sidebar.Items>
            <Sidebar.ItemGroup className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-100">
                Recommended Songs
              </h3>
              <div className="overflow-y-auto">
                <div className="flex flex-col gap-2">

                  {tracks && tracks.length > 0 ? (
                    tracks.map((track) => (
                      <div
                        key={track?.id}
                        className="flex flex-col items-center w-full justify-center rounded-lg p-4 gap-1 bg-gray-100 dark:bg-gray-400 dark:bg-gray-700"
                      >
                        <img
                          src={track?.album.images[0]?.url}
                          alt={track?.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-100">
                          {track?.name}
                        </p>
                        <p className="text-xs mb-2 font-semibold text-gray-600 dark:text-gray-100">
                          ({track?.album.name})
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-100">
                          by {track?.artists[0]?.name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      No tracks available
                    </p>
                  )}
                </div>
              </div>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      )}
    </>
  );
}
