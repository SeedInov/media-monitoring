import axios from "axios";

const instance = axios.create({
  baseURL:import.meta.env.VITE_API_BASEURL,
});

export default instance;

import.meta.env.VITE_API_BASEURL