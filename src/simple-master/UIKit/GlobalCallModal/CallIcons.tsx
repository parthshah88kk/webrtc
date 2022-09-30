import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';

import { styles } from './styles';

interface ICallIcons {
  icon: ImageSourcePropType;
  color?: string;
  onPress: () => void;
  iconSize?: number
  iconSizeBackground?: number
}

export const CallIcons: React.FC<ICallIcons> = ({ icon, color, onPress, iconSize, iconSizeBackground }) => {
  return (
    <View>
      <TouchableOpacity
        style={[styles.btnCall, !!color && { backgroundColor: color, width: iconSizeBackground ? iconSizeBackground : 50, height: iconSizeBackground ? iconSizeBackground : 50 }]}
        onPress={() => {
          onPress();
        }}>
        <Image
          style={[styles.icon,
          { width: iconSize ? iconSize : 25, height: iconSize ? iconSize : 25 },
          { tintColor: 'white' },
          ]}
          source={icon}
        />
      </TouchableOpacity>
    </View>
  );
};
