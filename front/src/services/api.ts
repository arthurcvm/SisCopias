import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL_PROD;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  config => {
    const token = Cookies.get('auth.token');

    const headers = { ...config.headers };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return { ...config, headers };
  },
  error => {
    return Promise.reject(new Error(error));
  },
);

/* const standardResponse = (response) => Promise.resolve(response);

const errorResponse = (error) => {
  notification.error({
    message: error.response.data.titulo,
    description: error.response.data.mensagem
  });

  if(error.response && error.response.status === 401) {
    return store.dispatch(AuthActions.unauthorized());
  }

  return Promise.reject(new Error(error));
}

api.interceptors.response.use(
  response => {
    return standardResponse(response);
  },
  error => {
    return errorResponse(error)
  },
);
*/

export default api;
