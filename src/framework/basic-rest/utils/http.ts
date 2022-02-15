import axios from "axios";
// import { getToken } from "./get-token";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Change request data/error here
http.interceptors.request.use(
  (config) => {
    // const token = getToken();
    config.headers = {
      api_key: process.env.NEXT_PUBLIC_CS_API_KEY || "",
      access_token: process.env.NEXT_PUBLIC_CS_DELIVERY_TOKEN || "",
      ...config.headers,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
