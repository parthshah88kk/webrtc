import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
import { CallEvents, TypeProps } from '../../WebRtcSimple/contains';
import WebrtcSimple from '../../index';
import { globalCall } from '../../../simple-master/UIKit';
import { useRoute } from '@react-navigation/core';
import { PUSH_CALL_TYPE, usePushNotification } from 'screens/login/usePushNotification';
import EncryptedStorage from 'react-native-encrypted-storage';

const ChatScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const fullName = (useRoute().params as any)?.fullName;
    const { sendFCMPush } = usePushNotification();
    const { params } = useRoute();
    const [type, setType] = useState<string>();
    const [remoteStream, setRemoteStream] = useState<any>(null);

    useEffect(() => {
        if (type !== CallEvents.message) { setType(type); }
        WebrtcSimple.listenings.getRemoteStream(remoteStream => { setRemoteStream(remoteStream) })
    }, []);

    const callToUser = async (callId: string, userId: number, item: any, callType: string) => {
        if (callId.length > 0) {
            let info: any = await EncryptedStorage.getItem('user_info');
            let device_uid: any = await EncryptedStorage.getItem('deviice_uid');
            if (info) info = JSON.parse(info);
            const useData = {
                sender_name: info?.fname + " " + info?.lname,
                sender_avatar: 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
                receiver_name: item?.fname + " " + item?.lname,
                receiver_avatar: 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
                user_id: userId,
                device_uid: device_uid,
                item: item,
                callType
            };
            globalCall.call(callId, useData);
        } else {
            Alert.alert('Please enter call Id');
        }
    };

    return (
        <View>
            <StatusBar barStyle="light-content" backgroundColor={'#729429'} />
            <View style={headerStyle.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Home') }}>
                        <Image source={require('../../../assets/images/icons/back.png')} style={[headerStyle.image, { tintColor: remoteStream ? 'black' : '#a033fe' }]} />
                    </TouchableOpacity>
                    <Image source={item?.url ? { uri: item?.url } : require('./icon/user.png')} style={headerStyle.image} />
                    <View>
                        <Text style={headerStyle.name}>{item.fname} {item.lname}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignSelf: 'center', paddingVertical: 15 }}>
                    <TouchableOpacity style={[headerStyle.option, { marginRight: 5 }]} onPress={() => { callToUser(item?.device_token[1].auth, item.id, item, 'AUDIO') }}>
                        <Image source={require('./icon/phone-receiver.png')} style={[headerStyle.image, { tintColor: '#a033fe' }]} />
                    </TouchableOpacity >
                    <TouchableOpacity style={headerStyle.option} onPress={() => { callToUser(item?.device_token, item.id, item, 'VIDEO') }}>
                        <Image source={require('./icon/video-camera.png')} style={[headerStyle.image, { tintColor: '#a033fe' }]} />
                    </TouchableOpacity >
                    <TouchableOpacity style={headerStyle.option} onPress={async () => {
                        navigation.navigate('CallLog');
                    }}>
                        <Image source={require('./icon/call-log.png')} style={[headerStyle.image, { tintColor: '#a033fe' }]} />
                    </TouchableOpacity >
                </View>
            </View>
        </View>
    )
};
const headerStyle = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        position: 'absolute',
        top: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        // opacity: 0.5,
        zIndex: 9999
    },
    name: {
        color: 'black',
        fontSize: 20,
        fontWeight: '600',
    },
    connectionStatus: {
        color: 'grey',
        fontSize: 17,
    },
    image: {
        width: 30,
        height: 30,
        marginRight: 10,
        borderRadius: 50,
        zIndex: 10000
    },
    option: { alignSelf: 'center' }
});
export default ChatScreen;


