//import axios from '@app/apis/axiosInstance';
import axios from '../axiosInstance';
//import axios from "axios";

const loginApi = (data: FormData) => {
  try {
    return axios.post('chat/login.php', data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

export default loginApi;
