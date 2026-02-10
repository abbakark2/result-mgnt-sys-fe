import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
})

axiosClient.interceptors.request.use((config)=>{
    config.headers.Authorization = `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`;
    return config;
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      localStorage.removeItem("ACCESS_TOKEN");
    }

    return Promise.reject(error); // ✅ VERY IMPORTANT
  }
);


export default axiosClient;