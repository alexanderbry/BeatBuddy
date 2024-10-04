import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSeveralTracks, fetchTracks, findUser } from "../redux/storeSpotify";
import { Card, Avatar } from "flowbite-react";

export default function Profile() {
  const { currentUser, tracks, isLoading, isError } = useSelector(
    (state) => state.spotify
  );
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(findUser());
    dispatch(fetchSeveralTracks());
  }, []);
  
  return (
    <div className="container mx-auto px-2 pb-2 flex flex-col items-center justify-center">
      <Card className="w-full h-full">
        <div className="flex flex-col items-center">
          <Avatar
            img={
              currentUser?.images[1]?.url ||
              "https://i.pinimg.com/originals/cc/2c/8a/cc2c8a4d90ad20e4d03c0225de4649a1.gif"
            }
            rounded
            className="mb-4"
            size="xl"
          />
          <h5 className="text-2xl font-bold tracking-tight text-green-500 hover:underline">
            <a href={currentUser?.external_urls.spotify}>{currentUser?.display_name || "Unknown User"}</a>
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Email : {currentUser?.email || "No email provided"}
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Followers : {currentUser?.followers.total || "No follower information"}
          </p>
        </div>

        <div className="h-full w-full mt-6">
          <div className="h-full">
            <h1 className="text-center font-bold text-gray-900 dark:text-white py-2">
              {currentUser?.display_name}&apos;s Favorite Tracks
            </h1>

            <div className="flex justify-center gap-4 p-4 bg-white dark:bg-gray-800">
              {tracks ? (
                tracks.slice(0, 5).map((track, index) => (
                  <Card
                    key={index}
                    imgSrc={track.album.images[2]?.url || "https://i.pinimg.com/originals/cc/2c/8a/cc2c8a4d90ad20e4d03c0225de4649a1.gif"}
                    className="w-64"
                  >
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {track.name}
                    </h5>
                    <p className="text-xs text-gray-700 dark:text-gray-400 truncate">
                      Artist : {track.artists[0]?.name}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-400 truncate">
                      Album : {track.album?.name}
                    </p>
                  </Card>
                ))
              ) : (
                <p className="text-gray-700 dark:text-gray-400">
                  No favorite tracks available.
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
