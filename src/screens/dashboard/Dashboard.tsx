import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/core';
import { Text, List, ListItem, Avatar, Modal } from '@ui-kitten/components';
import { get } from 'lodash';
import { Alert, StyleSheet, View, StatusBar } from 'react-native';
import FullScreenLoader from '../../screens/dashboard/FullScreenLoader';
import HomeHeader from '../../screens/dashboard/HomeHeader';
import { getFriendsApi } from '../../apis/home/api';
import EncryptedStorage from 'react-native-encrypted-storage';
import WebrtcSimple from '../../simple-master';
import { globalCall } from '../../simple-master/UIKit';
import { StackActions, useNavigation } from '@react-navigation/native';
import VideoCallHeader from '../../simple-master/UIKit/GlobalCallModal/VideoCallHeader';

import {
  PUSH_CALL_TYPE,
  usePushNotification,
} from 'screens/login/usePushNotification';
import SocketConnection from '../../socket_connection';

function Dashboard({ navigation }) {

  const { params } = useRoute();

  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fullName = (useRoute().params as any)?.fullName;
  const [receverName, setReceverName] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    getFriendsList();
    startConnection();

    const getUserName = async () => {
      let userName = await EncryptedStorage.getItem('user_name');
      setUserName(userName);
    }
    getUserName();
  }, []);

  async function getFriends() {
    const response = await getFriendsApi();
    // console.log('-------->', response.data);

    return response?.data;
  }

  const startConnection = async () => {
    const name = await EncryptedStorage.getItem('user_name');
    const configuration: any = { optional: null, key: name, };

    WebrtcSimple.start(configuration, { frameRate: 120 })
      .then(status => {
        if (status) {
          WebrtcSimple.getSessionId((sessionId: string) => {
            console.log("My Session Id", sessionId);
            setSessionId(sessionId);
          });
        }
      })
      .catch(err => { console.log(err); });
  };

  async function getFriendsList() {
    setLoading(true);
    getFriends().then(data => {
      if (get(data, 'status', '') !== 'success') {
        setError(get(data, 'data.message', 'Something went wrong'));
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      setFriends(data.data);
      console.log("friends======>", friends);

      setLoading(false);
    });
  }

  const header = () => {
    return <HomeHeader title="Home" />;
  };

  const renderText = item => {
    return (
      <Text style={styles.heading} category="s1">
        {item.fname} {item.lname}
      </Text>
    );
  };

  const renderItemIcon = item => {
    return (
      <View style={styles.avatarContainer}>
        <Avatar shape="medium" source={{ uri: item.url }} />
      </View>
    );
  };

  const renderItem = ({ item }: any) => (
    <ListItem
      key={item.id}
      title={() => renderText(item)}
      description={`${item.room_id ? item.room_id : ''}`}
      accessoryLeft={() => renderItemIcon(item)}
      style={styles.listItem}
      onPress={async () => {
        navigation.navigate('ChatScreen', { item });
      }}
    />
  );

  return (
    <>
      {userName && <SocketConnection userName={userName} />}
      <StatusBar barStyle="light-content" backgroundColor={'#729429'} />
      {loading ? (
        <FullScreenLoader />
      ) : (
        <List
          style={styles.listContainer}
          data={friends}
          renderItem={renderItem}
          ListHeaderComponent={header}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    height: 40,
    width: 40,
    backgroundColor: '#232055',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  heading: {
    color: '#0A082580',
    marginLeft: 6,
  },
  listItem: {
    height: 80,
    backgroundColor: '#E1DFE7',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
});

export default Dashboard;
