import React, {useLayoutEffect, useState} from 'react';

import EncryptedStorage from 'react-native-encrypted-storage';
import {isEmpty} from 'lodash';
import FullScreenLoader from './dashboard/FullScreenLoader';
//import { MainNavigation } from './MainNavigation';

function Main() {
  const [defaultRoute, setDefaultRoute] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<Boolean>(true);

  const getAuth = async () => {
    try {
      const token = await EncryptedStorage.getItem('user_token');
      const info = await EncryptedStorage.getItem('user_info');
      if (!isEmpty(token) && !isEmpty(info) && info) {
        const user = JSON.parse(info);
        //dispatch(authenticate({token: user.token, user: user}));
        setDefaultRoute('Home');
      }
    } catch (err) {
      console.log(err);
      await EncryptedStorage.removeItem('user_token');
    }
    setLoading(false);
  };

  useLayoutEffect(() => {
    getAuth();
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

  //return <MainNavigation defaultRoute={defaultRoute} />;
}

export default Main;
