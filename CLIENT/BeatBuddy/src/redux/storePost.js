import { createSlice } from "@reduxjs/toolkit";
import { api, spotifyApi } from "../api";

const initialState = {
  posts: [],
  tracks: [],
  loading: false,
  error: false,
  newPost: {
    caption: "",
    ProfileId: "",
    TrackId: "",
  },
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    fetchPostSuccess: (state, action) => {
      state.posts = action.payload;
    },
    fetchTracksData: (state, action) => {
      state.tracks = action.payload;
    },
    createNewPost: (state, action) => {
      state.newPost = {
        ...state.newPost,
        ...action.payload,
      };
    },
    isPostLoading: (state, action) => {
      state.loading = action.payload;
    },
    isPostError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  fetchPostSuccess,
  fetchTracksData,
  createNewPost,
  isPostLoading,
  isPostError,
} = postSlice.actions;

export const fetchPost = () => {
  return async (dispatch) => {
    try {
      dispatch(isPostLoading(true));

      const posts = await api.get("/");
      
      dispatch(fetchPostSuccess(posts.data));
    } catch (error) {
      dispatch(isPostError(error.message));
    } finally {
      dispatch(isPostLoading(false));
    }
  };
};

export const getSpotifyTracks = () => {
  return async (dispatch) => {
    
    try {
      dispatch(isPostLoading(true));
      const posts = await api.get("/");
      
      let FullData = await Promise.all(
        posts.data.map(async (post) => {
          let response = await spotifyApi.get(`/tracks/${post.TrackId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
            },
          });
          
          return response;
        })
      );
      dispatch(fetchTracksData(FullData));
    } catch (error) {
      dispatch(isPostError(error.message));
    } finally {
      dispatch(isPostLoading(false));
    }
  };
}

export default postSlice.reducer;
