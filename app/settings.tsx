import { Text, View, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import CreateAccount from '@/components/CreateAccount';
import SignIn from '@/components/SignIn';


export default function Settings() {

  const [loginToggle, setLoginToggle] = useState(true)

  return (
    <View style={styles.page}>
      {loginToggle ? <SignIn setLoginToggle={setLoginToggle} /> : <CreateAccount setLoginToggle={setLoginToggle}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    height: '100%',
    width: "100%",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});