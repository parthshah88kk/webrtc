import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {Icon} from '@ui-kitten/components';
import PropTypes from 'prop-types';

function HomeHeader({title}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTextView}>
        <Text numberOfLines={2} style={styles.heading}>
          {title}
        </Text>
      </View>
      <TouchableOpacity style={styles.searchIconContainer}>
      </TouchableOpacity>
    </View>
  );
}

HomeHeader.propTypes = {
  title: PropTypes.string
};

export default HomeHeader;

const styles = StyleSheet.create({
  searchIcon: {
    height: 30,
    width: 30,
  },
  header: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#729429',
    borderBottomWidth: 2,
    borderBottomColor: '#E3E3E3',
  },
  searchIconContainer: {
    height: 40,
    width: 60,
    marginRight: 15,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  headerTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  heading: {
    marginLeft: 15,
    color: '#FFFFFF',
    fontSize: 22
  }
});
