import {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import TokenService from "@/services/token.service";
import axios from "./axios-instance";

// intercepting requests
// Step-2: Create request, response & error handlers
const requestHandler = (request: InternalAxiosRequestConfig) => {
  // Token will be dynamic, so we can use any app-specific way to always
  // fetch the new token before making the call
  const token = TokenService.getLocalAccessToken();
  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
    request.headers["ngrok-skip-browser-warning"]= "69420"
  }
  return request;
};

const responseHandler = (response: AxiosResponse) => {
  response.headers["Authorization"] =
    `Bearer ${TokenService.getLocalAccessToken()}`;
  response.headers["ngrok-skip-browser-warning"]= "69420"

  return response;
};

const errorHandler = async (err: AxiosError) => {
  // const originalConfig = err.config;
  // if (
  //   !PUBLIC_ENDPOINTS.includes(
  //     originalConfig.url.split("?")[0]
  //       ? originalConfig.url.split("?")[0]
  //       : originalConfig.url,
  //   ) &&
  //   err.response
  // ) {
  //   // if (err.response.status === 401 || err.response.status === 403) {
  //   //   window.location.href = "/login";
  //   // }
  // }
  return Promise.reject(err);
};

const setup = () => {
  axios.interceptors.request.use(
    (request: InternalAxiosRequestConfig) => requestHandler(request),
    (error: AxiosError) => Promise.reject(error),
  );

  axios.interceptors.response.use(
    (response: AxiosResponse) => responseHandler(response),
    (error: AxiosError) => errorHandler(error),
  );
};

export default setup;
