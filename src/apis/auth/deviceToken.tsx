import axios from '../axiosInstance';

const insertTokenApi = (data: FormData) => {

  try {
    return axios.post('auth/insertToken.php', data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

export default insertTokenApi;
