import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_B_URL_API,
});

api.interceptors.request.use(
  (config) => {
    config.headers.authorization = `Bearer ${sessionStorage.getItem('tkn_gzap')}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage = {
      code: error?.response?.data?.code ?? 'any',
      message: error?.response?.data?.message ?? error?.message,
    };

    if (error?.message === 'Network Error') {
      errorMessage.message = 'Estamos enfrentando problemas. Tente novamente mais tarde.';
    }

    return Promise.reject(errorMessage);
  },
);
