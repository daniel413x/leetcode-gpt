import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const $host = axios.create({
  baseURL,
});

const $authHost = axios.create({
  baseURL,
});

const authInterceptor = (reqConfig: AxiosRequestConfig) => {
  const config = { ...reqConfig };
  const token = localStorage.getItem('token');
  config.headers!.authorization = `Bearer ${token}`;
  return config as {
    headers: AxiosRequestHeaders;
  };
};

$authHost.interceptors.request.use(authInterceptor);

export { baseURL, $host, $authHost };
