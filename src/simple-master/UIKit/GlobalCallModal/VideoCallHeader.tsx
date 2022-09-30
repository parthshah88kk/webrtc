import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  StyleSheet,
  Alert,
} from 'react-native';
import { CallEvents, TypeProps } from '../../WebRtcSimple/contains';
import { CallIcons } from './CallIcons';
import WebrtcSimple from '../../index';

interface IVideoCallHeader {
  callStatus?: string;
  name?: string;
  muted?: boolean;
}
const VideoCallHeader: React.FC<IVideoCallHeader> = ({
  callStatus,
  name,
  muted,
  data

}) => {
  useEffect(() => {
    console.log('Im shani header', data);

    if (type !== CallEvents.message) {
      setType(type);
    }
    WebrtcSimple.listenings.getRemoteStream(remoteStream => {
      setRemoteStream(remoteStream)
    })
  }, []);
  const [type, setType] = useState<string>();
  const [remoteStream, setRemoteStream] = useState<any>(null);


  return (
    <View style={headerStyle.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity >
          <Image source={require('../../../assets/images/icons/back.png')} style={[headerStyle.image, { tintColor: remoteStream ? 'black' : '#a033fe' }]} />
        </TouchableOpacity>
        <Image source={{ uri: data?.item?.url }} style={headerStyle.image} />
        <View>
          <Text style={headerStyle.name}>{data?.item?.fname} {data?.item?.lname}</Text>
        </View>
      </View>
      {/* <CallIcons icon={require('./icon/volume_white.png')} onPress={() => { }} /> */}
      {!remoteStream ?
        <View style={{ flexDirection: 'row', alignSelf: 'center', paddingVertical: 15 }}>
          <TouchableOpacity style={[headerStyle.option, { marginRight: 5 }]}>
            <Image source={require('./icon/phone-receiver.png')} style={[headerStyle.image, { tintColor: '#a033fe' }]} />
          </TouchableOpacity >
          <TouchableOpacity style={headerStyle.option} >
            <Image source={require('./icon/video-camera.png')} style={[headerStyle.image, { tintColor: '#a033fe' }]} />
          </TouchableOpacity >
        </View>
        :
        <View style={{ flexDirection: 'row', alignSelf: 'center', }}>
          <CallIcons
            // style={{width:30,height:30}}
            icon={require('./icon/messenger_black.png')}
            onPress={() => { }}
          />
          <TouchableOpacity style={headerStyle.option}>
            <Image source={require('../../../assets/images/icons/option.png')} style={headerStyle.image} />
          </TouchableOpacity >
        </View>
      }
    </View>
  );
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
export default VideoCallHeader;
