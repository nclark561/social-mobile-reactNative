import { StyleSheet, useColorScheme, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import UserMessage from '@/components/messageComponents/UserMessage';

const message1 = {
  username: 'kaethebae',
  message: 'hey whats up hey whats up hey whats up hey whats up hey whats up hey whats up hey whats up'
}

const message2 = {
  username: 'nclark561',
  message: 'Yo whats going on dude?'
}

const messages = [message1, message2, message1, message2, message1, message2, message1, message2, message1, message2, message1, message2, message1, message2, message1, message2]

export default function Conversation() {
  const translateX = useSharedValue(-300);
  const colorScheme = useColorScheme()

  const handleNavigate = () => router.navigate('/(tabs)/messages')

  useFocusEffect(
    useCallback(() => {
      translateX.value = withSpring(0, { damping: 15, stiffness: 100 })
      return () => translateX.value = withSpring(-300)
    }, [translateX])
  )

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 35 : 0}
    >
      <Animated.View style={[styles.screenContainer, animatedStyle]}>
        <ThemedView style={styles.screenContainer}>
          <ThemedView style={styles.header}>
            <Ionicons onPress={handleNavigate} size={25} name='arrow-back' color={colorScheme === 'dark' ? 'white' : 'black'} />
            <ThemedView style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Image style={styles.profilePic} source={{ uri: 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg' }} />
              <ThemedText style={{ fontSize: 20, textAlign: 'center' }}>Kale</ThemedText>
            </ThemedView>
            <ThemedView style={{ width: 25 }}></ThemedView>
          </ThemedView>
          <Animated.ScrollView style={{ width: '100%' }}>
            {messages.map((e, index) => <UserMessage key={index} username={e.username} message={e.message} />)}
          </Animated.ScrollView>
          <ThemedView style={[styles.textInputContainer, , colorScheme === 'dark' ? { backgroundColor: '#3b3b3b'} : { backgroundColor: '#d3d3d3' }]}>
            <TextInput multiline placeholder='start message' style={[styles.textInput, colorScheme === 'dark' && { color: 'white' }]} />
            <ThemedView style={styles.circle}>
              <Ionicons name='send' color='white' size={15}/>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  screenContainer: {
    flexDirection: 'column',
    height: '100%'
  },
  profilePic: {
    borderRadius: 25,
    height: 50,
    width: 50
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: '80%',
    paddingVertical: 5,
    maxHeight: 80
  },
  circle: {
    borderRadius: 25,
    width: 25,
    height: 25,
    backgroundColor: "#26a7de",
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInputContainer: {
    flexDirection: 'row',
    margin: 30,
    marginTop: 15,
    borderRadius: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5
  }
})
