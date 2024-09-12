import { StyleSheet, useColorScheme, Image } from 'react-native'
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
  const colorScheme =useColorScheme()

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
    <Animated.View style={[styles.screenContainer, animatedStyle]}>
      <ThemedView style={styles.screenContainer}>
        <ThemedView style={styles.header}>
            <Ionicons onPress={handleNavigate} size={25} name='arrow-back' color={colorScheme === 'dark' ? 'white' : 'black'}/>
            <ThemedView style={{flexDirection: 'column', alignItems: 'center'}}>
              <Image style={styles.profilePic} source={{ uri: 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg' }} />
              <ThemedText style={{ fontSize: 20, textAlign: 'center' }}>Kale</ThemedText>
            </ThemedView>
            <ThemedView style={{ width: 25 }}></ThemedView>
        </ThemedView>
        <Animated.ScrollView style={{ width: '100%'}}>
            {messages.map(e => <UserMessage username={e.username} message={e.message}/>)}
        </Animated.ScrollView>
      </ThemedView>
    </Animated.View>
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
})
