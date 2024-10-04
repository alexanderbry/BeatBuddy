import axios from "axios";

export const api = axios.create({
    baseURL: 'http://13.54.13.234',
  });

export const spotifyApi = axios.create({
    baseURL: 'https://api.spotify.com/v1',
  });