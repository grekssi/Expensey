import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text } from 'react-native';

const AnimatedExpenseItem = ({ expense, delay, onToggleModal }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          },
        ],
        opacity: animValue,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginVertical: 3,
          borderWidth: 2,
          borderRadius: 5,
        }}
        onPress={onToggleModal}
      >
        <Text style={{ color: 'white', fontSize: 20 }}>{expense}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedExpenseItem;
