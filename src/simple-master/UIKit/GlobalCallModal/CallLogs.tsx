import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/core';
import { Text, List, ListItem, Avatar, Modal } from '@ui-kitten/components';
import { get } from 'lodash';
import { Alert, StyleSheet, View, StatusBar } from 'react-native';
import { getCallLogApi } from '../../../apis/home/api';

function CallLog({ navigation }) {

    const { params } = useRoute();

    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const fullName = (useRoute().params as any)?.fullName;
    const [receverName, setReceverName] = useState<string>('');
    const [sessionId, setSessionId] = useState<string>('');

    useEffect(() => {
        getFCallLogList();
    }, [])
    async function getFriends() {
        const response = await getCallLogApi();
        console.log("responseresponseresponse", JSON.stringify(response.data));
        return response?.data;
    }
    async function getFCallLogList() {
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
            // console.log("friends======>", friends);

            setLoading(false);
        });
    }

    //   useEffect(() => {
    //     getFriendsList();
    //     startConnection();


    //   async function getFriends() {
    //     const response = await getFriendsApi();
    //     console.log("responseresponseresponse", JSON.stringify(response.data));
    //     return response?.data;
    //   }

    //   async function getFriendsList() {
    //     setLoading(true);
    //     getFriends().then(data => {
    //       if (get(data, 'status', '') !== 'success') {
    //         setError(get(data, 'data.message', 'Something went wrong'));
    //         setTimeout(() => {
    //           setError(null);
    //         }, 3000);
    //         return;
    //       }
    //       setFriends(data.data);
    //       // console.log("friends======>", friends);

    //       setLoading(false);
    //     });
    //   }

    //   const header = () => {
    //     return <HomeHeader title="Home" />;
    //   };

    const renderText = item => {
        return (
            <>
                <Text style={styles.heading} category="s1">
                    {item.receiver_name}
                </Text>
                <Text style={styles.subHeading}>
                    {item.message}
                </Text>
                <Text style={styles.subHeading}>
                    {' ' + item.date}
                </Text>
            </>
        );
    };

    const renderItemIcon = item => {
        return (
            <View style={styles.avatarContainer}>
                <Avatar shape="medium" source={{ uri: item.receiver_pic }} />
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
            <StatusBar barStyle="light-content" backgroundColor={'#729429'} />
            {/* {loading ? (
        <FullScreenLoader />
      ) : ( */}
            <List
                style={styles.listContainer}
                data={friends}
                renderItem={renderItem}
            //   ListHeaderComponent={header}
            />
            {/* )} */}
            <View>
                <Text>Hii</Text>
            </View>
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
        fontWeight: '700'
    },
    subHeading: {
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

export default CallLog;
