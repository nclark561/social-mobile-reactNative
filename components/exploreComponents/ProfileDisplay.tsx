import { StyleSheet, Image } from 'react-native'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import { useColorScheme } from 'react-native'

interface user {
    name: string,
    username: string,
    profilePic: string
}

interface ProfileDisplayProps {
    user: user
}

const ProfileDisplay = ({ user }: ProfileDisplayProps) => {
  const colorScheme = useColorScheme()

  const fadedTextColor = colorScheme === "dark" ? '#525252' : "#bebebe" 

  return (
    <ThemedView style={styles.previewContainer}>
      <Image style={styles.profilePic} source={{uri: user.profilePic}}/>
      <ThemedView style={styles.profileInfo}>
        <ThemedText>{user.name}</ThemedText>
        <ThemedText style={{color: fadedTextColor}}>@{user.username}</ThemedText>
      </ThemedView>
    </ThemedView>
  )
}

export default ProfileDisplay

const styles = StyleSheet.create({
    previewContainer: {
        flexDirection: 'row',
        margin: 12
    },
    profilePic: {
        borderRadius: 25,
        height: 50,
        width: 50
    },
    profileInfo: {
        flexDirection: 'column',
        marginLeft: 10
    }
})