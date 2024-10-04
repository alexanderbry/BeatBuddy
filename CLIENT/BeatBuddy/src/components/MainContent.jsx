import { Avatar, Button, Card, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing icons
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import { findUser } from "../redux/storeSpotify";
import { createNewPost, fetchPost, getSpotifyTracks } from "../redux/storePost";
import ModalButton from "./Modal";
import { api, spotifyApi } from "../api";
import Swal from "sweetalert2";

export function MainContent() {
  const { currentUser, isLoading, isError } = useSelector(
    (state) => state.spotify
  );

  const { posts, tracks, newPost, loading, error } = useSelector(
    (state) => state.post
  );
  const dispatch = useDispatch();

  const [editingPostId, setEditingPostId] = useState(null);
  const [editedCaption, setEditedCaption] = useState(""); 

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      let ProfileId = await api.get(
        `/profiles/profile?ProfileId=${currentUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      let { caption, TrackId } = newPost;
      
      if (!caption || !ProfileId || !TrackId) {
        return Swal.fire({
          title: "Please fill in all fields",
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
      ProfileId = await api.get(
        `/profiles/profile?ProfileId=${currentUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      let postData = await spotifyApi.get(`/tracks/${TrackId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
        },
      });

      await api.post(
        "/posts/create",
        {
          caption,
          ProfileId: ProfileId.data.id,
          TrackId,
          imageUrl: postData.data.album.images[0].url,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      dispatch(fetchPost());
      dispatch(getSpotifyTracks(posts));
    } catch (error) {
      console.log(error, "<<<<<");

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

  const handleCaptionChange = (e) => {
    dispatch(createNewPost({ ...newPost, caption: e.target.value }));
  };

  const handleProfileChange = async () => {
    let ProfileId = await api.get(
      `/profiles/profile?ProfileId=${currentUser.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    dispatch(createNewPost({ ...newPost, ProfileId: ProfileId.data.UserId }));
  };

  const handleDeletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      dispatch(fetchPost());
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

  const handleEditPost = (id, currentCaption) => {
    setEditingPostId(id);
    setEditedCaption(currentCaption);
  };

  const handleUpdatePost = async (id) => {
    try {
      await api.patch(
        `/posts/${id}`,
        { caption: editedCaption },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      dispatch(fetchPost());
      setEditingPostId(null);
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
console.log(tracks);

  useEffect(() => {
    dispatch(findUser());
    dispatch(fetchPost());
    handleProfileChange();
    dispatch(getSpotifyTracks(posts));
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      {loading && <Loading />}
      <div className="container mx-auto px-2 pb-2">
        {currentUser.display_name ? (
          <Card className="flex flex-col gap-4">
            <form onSubmit={(e) => handleCreatePost(e)}>

                <Avatar
                  img={
                    currentUser.images
                      ? currentUser.images[0].url
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  rounded
                  className="flex justify-start"
                >
                  <div className="font-medium dark:text-white">
                    <div>{currentUser.display_name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <Link to={currentUser.href} className="text-green-500">
                        Find me on spotify!
                      </Link>
                    </div>
                  </div>
                </Avatar>
                <Textarea
                  id="textarea"
                  placeholder="What's your thoughts?"
                  required
                  rows={4}
                  value={newPost.caption}
                  onChange={handleCaptionChange}
                  theme={{
                    base: "block w-full rounded-lg border text-sm disabled:cursor-not-allowed disabled:opacity-50 mt-4",
                    colors: {
                      gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500",
                    },
                  }}
                />
                <div className="flex justify-center gap-4 mt-4 w-full">

                  <Button type="submit" color="green">
                    Submit
                  </Button>
                </div>

            </form>
            <div className="flex justify-center w-full">
              <ModalButton className="w-full" />
            </div>
          </Card>
        ) : (
          <></>
        )}

        {posts &&
          posts.map((post, i) => (
            <Card
              key={post.id}
              imgSrc={
                post
                  ? post.imageUrl
                  : "https://i.pinimg.com/736x/1a/1e/af/1a1eaf4f02639b0375a640a2715b0ed1.jpg"
              }
              horizontal
              className="mx-auto my-4 relative"
              theme={{
                root: {
                  base: "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
                  children: "flex h-full flex-col justify-center p-6",
                  horizontal: {
                    off: "flex-col",
                    on: "flex-row",
                  },
                  href: "hover:bg-gray-100 dark:hover:bg-gray-700",
                },
                img: {
                  base: "",
                  horizontal: {
                    off: "rounded-t-lg",
                    on: "h-48 w-48 object-cover rounded-l-lg",
                  },
                },
              }}
            >
              {currentUser.id === post.Profile.spotifyId ? (
                <div className="absolute top-2 right-2 flex gap-2">
                  <FaEdit
                    onClick={() => handleEditPost(post.id, post.caption)} // Set to edit mode
                    className="text-gray-500 hover:text-blue-500 cursor-pointer"
                    size={18}
                  />
                  <FaTrash
                    onClick={() => handleDeletePost(post.id)}
                    className="text-gray-500 hover:text-red-500 cursor-pointer"
                    size={18}
                  />
                </div>
              ) : (
                <></>
              )}

              <div className="flex flex-col justify-between h-full">
                <div>
                  <Avatar
                    img={
                      post
                        ? post.Profile.profilePicture
                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    }
                    rounded
                    className="flex justify-start mb-2"
                  >
                    <div className="font-medium dark:text-white">
                      <div>{post.Profile.fullName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-bold text-gray-700 dark:text-gray-200">
                          #NowPlaying{" "}
                        </span>{" "}
                        <span className="font-bold text-green-500">
                          <Link to={`https://open.spotify.com/track/${tracks && tracks[i]?.data.id}`}>
                          {tracks && tracks[i]?.data.name}
                          </Link>
                        </span>{" "}
                        by{" "}
                        <span className="text-green-500">
                          {tracks && tracks[i]?.data.artists[0].name}
                        </span>
                      </div>
                    </div>
                  </Avatar>

                  {/* Check if this post is being edited */}
                  {editingPostId === post.id ? (
                    <>
                      <Textarea
                        value={editedCaption}
                        onChange={(e) => setEditedCaption(e.target.value)}
                        rows={2}
                        className="w-full mt-2"
                      />
                      <Button
                        onClick={() => handleUpdatePost(post.id)}
                        className="mt-2"
                        color="green"
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                      {post.caption}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
      </div>
    </>
  );
}
