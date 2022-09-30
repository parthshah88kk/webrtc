import EncryptedStorage from 'react-native-encrypted-storage';
import axios from '../axiosInstance';

const getFriendsApi = async () => {
  let formData = new FormData();
  let token = await EncryptedStorage.getItem('user_token');
  formData.append('token', `${token}`);
  return axios.post('chat/GetOneToOneChat.php', formData);
};
const getCallLogApi = async () => {
  let formData = new FormData();
  let token = await EncryptedStorage.getItem('user_token');
  let roomId = '61af737a33e8b'
  formData.append('token', `${token}`);
  formData.append('room_id', `${roomId}`);
  return axios.post('chat/callLogs.php', formData);
};

export { getFriendsApi };
export { getCallLogApi };
