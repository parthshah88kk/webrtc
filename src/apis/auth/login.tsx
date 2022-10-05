import axios from '../axiosInstance';

const loginApi = (data: FormData) => {

  try {
    // return axios.post('checklogin.php', data);
    return axios.post('chat/login.php', data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

export default loginApi;
