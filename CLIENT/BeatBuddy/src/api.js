import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:3000',
  });

export const spotifyApi = axios.create({
    baseURL: 'https://api.spotify.com/v1',
  });