import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCall: {
    width: 50,
    height: 50,
    borderRadius: 35,
    // marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  icon: {
    width: 25,
    height: 25,
  },
  manageCall: {
    flexDirection: 'row',
    marginVertical: 20,
    position: 'absolute',
    bottom: 10,
  },
  boxMyStream: {
    borderRadius: 16,
    padding: 3,
    position: 'absolute',
    zIndex: 999,
    bottom: 170,
    backgroundColor: 'transparent',
    right: 10,
  },
  myStream: {
    width: 180,
    height: 200,
    borderRadius: 8,
    borderColor: 'transparent',
    zIndex: 999
  },
  iconCamera: {
    width: 30,
    height: 30,
    position: 'absolute',
    zIndex: 999,
    tintColor: 'white',
    right: 10,
    bottom: 10,
  },
  stream: {
    width: width,
    height: height,
  },
  incomingView: {
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    backgroundColor: '#1a2235',
    width: '100%'
  },
  incoming: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    marginTop: 30,
  },
  name: {
    fontSize: 28,
    color: 'white',
    fontWeight: '500',
    marginTop: 70,
    textAlign: 'center'
    // marginBottom: 40
  },
  cube: {
    fontSize: 16,
    color: 'white',
    fontWeight: '200',
    marginTop: 5,
    // marginBottom: 10
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 120,
    // marginTop: 180,
  },
  timer: {
    backgroundColor: 'transparent',
    minWidth: 70,
    minHeight: 70,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    top: 40,
    position: 'absolute',

  },
  textTimer: {
    fontSize: 20,
    textAlign: 'center'
  },
  timer2: {
    backgroundColor: 'transparent',
    minWidth: 70,
    minHeight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    zIndex: 9,
    right: 10,
    top: 10,
  },
  textTimer2: {
    fontSize: 12,
  },
});
