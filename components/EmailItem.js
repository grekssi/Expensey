import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text } from 'react-native';

const EmailItem = ({ email, index, navigation, onLayoutHandler, emailsLength }) => {
  return (
    <TouchableOpacity
      key={index}
      style={styles.userContainer}
      onPress={() => navigation.navigate('Images', { email })}
      onLayout={index === emailsLength - 1 ? onLayoutHandler : undefined}
    >
      <Text style={styles.userEmail}>{email}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    userContainer: {
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    userEmail: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#424242",
    },
  });

export default EmailItem;