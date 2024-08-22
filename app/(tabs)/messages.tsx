import ParallaxScrollView from "@/components/ParallaxScrollView"
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text } from "react-native";

export default function messages() {
  return (
    <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Ionicons size={310} name="mail-outline" style={styles.messageLogo} />}>
        <Text>Messages</Text>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    messageLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
  });