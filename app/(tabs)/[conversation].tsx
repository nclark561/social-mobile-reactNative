import { StyleSheet} from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function Conversation() {
  const translateX = useSharedValue(-300);

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
        <ThemedView style={styles.header}>
            <Ionicons onPress={handleNavigate} size={25} name='arrow-back' color={'white'}/>
        </ThemedView>
        <ThemedView>
            <ThemedText>Conversation</ThemedText>
        </ThemedView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    screenContainer: {
        flexDirection: 'column'
    }
})
