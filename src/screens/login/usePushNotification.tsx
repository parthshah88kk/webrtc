import { useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { isEmpty } from 'lodash';

export const usePushNotification = () => {
  const BASE_URL = 'https://sipocloudpos.com/dev_server/public/api/';
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'multipart/form-data;',
    },
    timeout: 15 * 1000, // 15 sec
  });

  const [deviceToken, setDeviceToken] = useState('');

  const requestNotificationPermission = async (userId: number) => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled && !deviceToken) {
      await generateToken(userId);
    }
  };

  const generateToken = async (userId: number) => {
    const token = await messaging().getToken();
    updateDeviceToken(token, userId);
    setDeviceToken(token);
  };

  const post = async <R = any,>(
    url: string,
    params?: any,
  ): Promise<AxiosResponse<R & { Response: any }>> => {
    try {
      const response = await instance.post(url, params);
      return response;
    } catch (error) {
      return error as any;
    }
  };

  const updateDeviceToken = async (token: string, userId: number) => {
    let formData = new FormData();
    formData.append('token', token);
    formData.append('id', userId);
    const response = await post(BASE_URL + 'insertfctoken', formData);
    console.log('update__Response', response.status);
  };

  const sendFCMPush = async (
    type: PUSH_CALL_TYPE,
    callerName: string,
    calleeId: number,
  ) => {
    let formData = new FormData();
    formData.append('type', type);
    formData.append('callerName', callerName);
    formData.append('id', calleeId);
    const response = await post(BASE_URL + 'pushfcm', formData);
    console.log('responsess2', response.status);
  };

  return {
    deviceToken,
    setDeviceToken,
    requestNotificationPermission,
    sendFCMPush,
  };
};

export enum PUSH_CALL_TYPE {
  INCOMING = 'incomingcall',
  DISCONNECTED = 'calldisconnected',
}
