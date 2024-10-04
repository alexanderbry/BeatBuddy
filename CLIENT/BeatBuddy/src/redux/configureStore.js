import { configureStore } from "@reduxjs/toolkit";

import { spotifySlice } from "./storeSpotify";
import { postSlice } from "./storePost";

export default configureStore({
  reducer: {
    spotify: spotifySlice.reducer,
    post: postSlice.reducer,
  },
});
