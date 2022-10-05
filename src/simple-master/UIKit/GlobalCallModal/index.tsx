import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Button, } from '@ui-kitten/components';
import { DeviceEventEmitter, Image, TouchableOpacity, Modal, StatusBar, StyleSheet, Text, View, } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import WebrtcSimple from '../../index';
import { CallEvents } from '../../WebRtcSimple/contains';
import { Timer } from '../index';
import DisabledVideo from './DisabledVideo';
import { styles } from './styles';
import VideoCallFooter from './VideoCallFooter';
import VideoCallHeader from './VideoCallHeader';
import SoundPlayer from 'react-native-sound-player';
import EncryptedStorage from 'react-native-encrypted-storage';
import WebRTCSimple from '../../index';
import LoudSpeaker from 'react-native-loud-speaker';

let interval: any = null;
const ringtime = 20;
StatusBar.setBarStyle('dark-content');
export const globalCallRef = React.createRef<any>();
export const globalCall = {
  call: (sessionId: string, userData: object) => {
    // console.log('1111', sessionId);
    globalCallRef?.current?.call(sessionId, userData);
    // console.log('22222', sessionId);
  },
  endCall: () => {
    globalCallRef?.current?.endCall();
  },
  setIsCallAgainMethod: () => {
    globalCallRef?.current?.setIsCallAgainMethod();
  }
};

export interface Props { name?: string; }

StatusBar.setBarStyle('dark-content');

const GlobalCallUI = React.forwardRef((props, ref) => {
  useEffect(() => {
    DeviceEventEmitter.addListener('accept', () => { acceptCall(); });
    DeviceEventEmitter.addListener('reject', () => endCall());
  }, []);

  const [userData, setUserData] = useState(null);
  const [myName, setMyName] = useState(null);
  const [isCallAgain, setIsCallAgain] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>();
  const [type, setType] = useState<string>();
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [audioEnable, setAudioEnable] = useState<boolean>();
  const [loudSpeakerEnable, setLoudSpeakerEnable] = useState<boolean>();
  const [videoEnabled, setVideoEnable] = useState<boolean>(true);
  const [cameraType] = useState<'front' | 'end'>('front');
  const [remoteCameraType, setRemoteCameraType] = useState<'front' | 'end'>('front');
  const stream = WebRTCSimple.getLocalStream();

  const [screen, setScreen] = useState<string>('Caller');


  useImperativeHandle(ref, () => { return { call, endCall, setIsCallAgainMethod }; });

  useEffect(() => {
    steMydataFun();
    WebrtcSimple.listenings.getRemoteStream(remoteStream => {
      setRemoteStream(remoteStream);
    });
    WebrtcSimple.listenings.callEvents((type, userData: any) => {

      if (type === CallEvents.start) setScreen('Caller');
      if (type === CallEvents.received) setScreen('Receiver');
      if (type !== CallEvents.message) setType(type);
      if (type === CallEvents.received || type === CallEvents.start) {
        setUserData(userData);
        video(userData?.callType === 'VIDEO' ? true : false);
        audio(false);
        loudSpeaker(false);
        let time = ringtime;
        interval = setInterval(() => {
          time = time - 1;
          if (time === 0) {
            SoundPlayer.stop(); endCall(); clearInterval(interval);
          }
        }, 1000);
        setVisible(true);
      }

      if (type === CallEvents.received) {
        WebrtcSimple.events.vibration.start(20);
        try {
          SoundPlayer.playSoundFile('ring', 'mp3')
        } catch (e) {
          console.log(`cannot play the sound file`, e)
        }
      }

      if (type === CallEvents.accept) {
        clearInterval(interval);
        // LoudSpeaker.open(true);
        WebrtcSimple.events.vibration.cancel();
        SoundPlayer.stop();
        setScreen('OnCall')
      }

      if (type === CallEvents.end) {
        clearInterval(interval);
        WebrtcSimple.events.vibration.cancel();
        SoundPlayer.stop();
        setVisible(false);
        setAudioEnable(true);
        setLoudSpeakerEnable(true);
        setVideoEnable(true);
      }

      if (type === CallEvents.message) {
        if (userData?.message?.type === 'SWITCH_CAMERA') {
          setRemoteCameraType(userData?.message?.value);
        }
      }
    });
    return () => { setIsCallAgain(false); setScreen('Caller') };
  }, []);

  const steMydataFun = async () => {
    let info: any = await EncryptedStorage.getItem('user_info');
    if (info) info = JSON.parse(info);
    let myName: any = info?.fname + " " + info?.lname;
    setMyName(myName);
  }

  const call = async (sessionId: string, userData: any) => {
    console.log('//////======', userData);
    setUserData(userData);
    setVisible(true);
    setType('START_CALL');
    setScreen('Caller')
    WebrtcSimple.events.call(sessionId, userData);
  };

  const acceptCall = () => WebrtcSimple.events.acceptCall();

  //if call not connected then allow call again
  const setIsCallAgainMethod = () => { setScreen('Caller'); setIsCallAgain(!isCallAgain); }

  const endCall = () => {
    WebrtcSimple.events.endCall();
    SoundPlayer.stop();
  };

  // Enable and disable video of the events
  const video = (enable: boolean) => {
    setVideoEnable(enable);
    WebrtcSimple.events.videoEnable(enable);
    if (enable) {
      WebrtcSimple.events.message({ type: 'CAMERA', value: 'ON' });
    } else {
      WebrtcSimple.events.message({ type: 'CAMERA', value: 'OFF' });
    }
  };

  // Enable and disable audio of the events
  const audio = (enable: boolean) => {
    setAudioEnable(!audioEnable);
    WebrtcSimple.events.audioEnable(enable);
  }

  // Enable and disable loudSpeaker of the events
  const loudSpeaker = (enable: boolean) => {
    setLoudSpeakerEnable(!loudSpeakerEnable);
    LoudSpeaker.open(enable);
  }

  const rejectCall = () => {
    setVisible(false);
    setIsCallAgain(false);
    setScreen('');
    endCall();
  };

  if (!visible) return null;

  const CallerScreen = () => {
    return (
      <View>
        <View style={style.imageView}>
          {
            userData?.receiver_avatar
              ? <Image source={{ uri: userData?.receiver_avatar }}
                style={{ height: 150, width: 150, borderRadius: 100, alignSelf: 'center', marginBottom: 10 }} />
              : <Image source={require('./icon/user.png')}
                style={{ height: 150, width: 150, borderRadius: 100, alignSelf: 'center', marginBottom: 10 }} />
          }
          <Text style={style.textBold}>{userData?.receiver_name}</Text>
          {isCallAgain
            ? <View style={{ alignItems: 'center', width: '80%' }}>
              <Text style={{ textAlign: 'center', color: 'white' }}>No response</Text>
              <View
                style={{
                  // display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-around',
                  marginRight: 20,
                  // backgroundColor: 'yellow',
                  alignItems: 'center',
                  marginTop: 140
                }}>
                <TouchableOpacity onPress={() => { setIsCallAgainMethod(); call(userData?.item?.username, userData) }}>
                  <View style={style.acceptCallView}>
                    <Text style={style.endCallText}>Try again</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { rejectCall() }}>
                  <View style={style.endCallView}>
                    <Text style={style.endCallText}>Exit</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            : <Text style={{ color: 'white' }}>Calling...</Text>
          }
        </View>
      </View>
    )
  }

  const ReceiverScreen = () => {
    return (
      <View>
        <View style={styles.incomingView}>
          <Text style={styles.incoming}>Incoming call...</Text>
          {/* <Text style={styles.cube}>{userData?.sessionId}</Text>
          <Text style={[styles.cube, { marginBottom: 20 }]}>Share Slate</Text> */}
        </View>
        <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 250 }}>
          <Image style={styles.avatar} source={{ uri: userData?.sender_avatar }} />
        </View>
        <Text style={styles.name}>{userData?.sender_name}</Text>
      </View>
    )
  }

  const OnCallScreen = () => {
    return (
      <>
        {userData?.callType === 'VIDEO'
          ? <>
            {/* Other Video */}
            <View style={style.container}>
              <Text style={style.textBold}>{userData?.receiver_name == myName ? userData?.sender_name : userData?.receiver_name}</Text>
              <RTCView
                mirror={remoteCameraType === 'front' ? true : false}
                streamURL={remoteStream?.toURL()}
                zOrder={99}
                style={styles.stream}
                objectFit="cover"
              />
            </View>

            {/* My video */}
            <View style={styles.boxMyStream}>
              {videoEnabled && <RTCView
                mirror={cameraType === 'front' ? true : false}
                streamURL={stream?.toURL()}
                style={styles.myStream}
                objectFit="cover"
              />
              }
            </View>
          </>
          : <View style={{ alignSelf: 'center', backgroundColor: '#323232' }}>
            <View style={style.imageView}>
              {
                userData?.receiver_avatar
                  ? <Image source={{ uri: userData?.receiver_avatar }}
                    style={{ height: 150, width: 150, borderRadius: 100, alignSelf: 'center', marginBottom: 10 }} />
                  : <Image source={require('./icon/user.png')}
                    style={{ height: 150, width: 150, borderRadius: 100, alignSelf: 'center', marginBottom: 10 }} />
              }
              <Text style={style.textBold}>{userData?.receiver_name == myName ? userData?.sender_name : userData?.receiver_name}</Text>
            </View>
          </View>
        }
        <>
          {/* <VideoCallHeader data={userData} /> */}
        </>
      </>
    )
  }

  return (
    <>
      <Modal visible={visible} transparent onRequestClose={() => { setVisible(false); }}>
        <View style={{
          flex: 1,
          backgroundColor: '#323232',
        }}>
          {screen === 'Receiver' && <ReceiverScreen />}
          {screen === 'Caller' && <CallerScreen />}
          {screen === 'OnCall' && <OnCallScreen />}
          {/* Footer */}
          {screen
            ? <>
              {type === CallEvents.accept && <Timer style={styles.timer} textStyle={styles.textTimer} start />}
              <VideoCallFooter
                data={userData}
                isCallAgain={isCallAgain}
                onAccept={acceptCall}
                onEndCall={rejectCall}
                callStatus={type}
                videoDisabled={videoEnabled}
                audioDisabled={audioEnable}
                loudSpeakerDisabled={loudSpeakerEnable}
                toggleAudio={() => { audio(!audioEnable); }}
                toggleLoudSpeaker={() => { loudSpeaker(!loudSpeakerEnable); }}
                toggleVideo={() => { video(!videoEnabled); }}
              />
            </>
            : null
          }
        </View>
      </Modal>
    </>
  );
});

export default GlobalCallUI;

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1D1D20',
    alignContent: 'center',
    justifyContent: 'center',
  },
  textBold: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  imageView: {
    marginTop: 150,
    alignItems: 'center',
    width: '100%'
  },
  endCallView: {
    backgroundColor: '#EF3737',
    paddingHorizontal: 38,
    width: '120%',
    paddingVertical: 12,
    borderRadius: 50,
    // marginLeft: 25
  },
  endCallText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  acceptCallView: {
    backgroundColor: '#37CEEF',
    paddingHorizontal: 25,
    // width: '150%',
    paddingVertical: 12,
    borderRadius: 50
  }

});
