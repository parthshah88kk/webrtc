import axios, { AxiosRequestConfig } from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { isEmpty } from 'lodash';

const instance = axios.create({
  baseURL: 'https://shareslate.com/apis/',
  headers: {
    'Content-Type': 'multipart/form-data;',
  },
});

https: instance.interceptors.request.use(async function (
  config: AxiosRequestConfig,
) {
  try {
    const token = await EncryptedStorage.getItem('user_token');
    if (!isEmpty(token)) {
      config.data.append('token', token);
    }
    return config;
  } catch (err) {
    console.log('jibin', err);
  }
});

export default instance;
