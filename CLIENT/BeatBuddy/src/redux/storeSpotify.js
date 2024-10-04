import { createSlice } from "@reduxjs/toolkit";
import { spotifyApi } from "../api";

const initialState = {
  currentUser: {},
  tracks: {},
  isLoading: false,
  isError: false,
};

export const spotifySlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    fetchUser: (state, action) => {
      state.currentUser = action.payload;
    },
    fetchTracks: (state, action) => {
      state.tracks = action.payload;
    },
    isLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    isError: (state, action) => {
      state.isError = action.payload;
    },
  },
});

export const { fetchUser, fetchTracks, isError, isLoading } =
  spotifySlice.actions;

export const findUser = () => {
  return async (dispatch) => {
    try {
      dispatch(isLoading(true));
      
      const user = await spotifyApi.get(`/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
        },
      });
      
      const image = await spotifyApi.get(`/users/${user.data.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
        },
      });

      dispatch(fetchUser(user.data, image.data.images[0]));
    } catch (error) {
      dispatch(isError(error));
    } finally {
      dispatch(isLoading(false));
    }
  };
};

export const fetchSeveralTracks = () => {
  return async (dispatch) => {
    try {
      dispatch(isLoading(true));
      const ids =
        "7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B";

      const response = await spotifyApi.get(`/tracks?ids=${ids}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
        },
      });

      dispatch(fetchTracks(response.data.tracks));
    } catch (error) {
      dispatch(isError(error));
    } finally {
      dispatch(isLoading(false));
    }
  };
};

export default spotifySlice.reducer;
