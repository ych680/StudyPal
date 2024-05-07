import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BackArrow from '../pages/Signup/assets/back-arrow.svg';
import tw from 'tailwind-rn';

const Header = ({ title }) => {
  return (
    <View>
      <TouchableOpacity>
        <BackArrow width={100} height={100} />
      </TouchableOpacity>
      <Text>{title}</Text>
    </View>
  )
}

export default Header;
