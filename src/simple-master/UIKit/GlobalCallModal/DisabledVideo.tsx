import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
interface IDisabledVideo {
  url?: string;
}
const DisabledVideo: React.FC<IDisabledVideo> = ({ url }) => {
  return (
    <View style={style.container}>
      <Image
        source={require('./icon/user.png')}
        style={{
          height: 50,
          width: 50,
          borderRadius: 100,
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

export default DisabledVideo;
const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1D1D20',
    marginTop: '60%',
  },
});
