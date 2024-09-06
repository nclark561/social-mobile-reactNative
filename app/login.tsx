import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import CreateAccount from '@/components/CreateAccount';
import SignIn from '@/components/SignIn';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';



export default function Login() {

  const [login, setLogin] = useState(true)

  return (
    <ThemedView style={styles.page}>      
      {login ? <SignIn setLogin={setLogin} /> : <CreateAccount setLoginToggle={setLogin} />}
    </ThemedView>
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