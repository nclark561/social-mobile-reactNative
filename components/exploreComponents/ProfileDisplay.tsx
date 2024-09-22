import { StyleSheet, Image } from 'react-native'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import { useColorScheme } from 'react-native'
import { useState } from 'react'

interface user {
    email: string,
    username: string,
    id?: string
}

interface ProfileDisplayProps {
    user: user
}

const ProfileDisplay = ({ user }: ProfileDisplayProps) => {
  const colorScheme = useColorScheme()
  const [profileImageUri, setProfileImageUri] = useState(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${user.id}.jpg?${Date.now()}`)
  const mortyUrl = 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg'

  const handleError = () => {
    setProfileImageUri(mortyUrl);
  };

  const fadedTextColor = colorScheme === "dark" ? '#525252' : "#bebebe" 

  return (
    <ThemedView style={styles.previewContainer}>
      <Image style={styles.profilePic} source={{uri: profileImageUri}} onError={handleError}/>
      <ThemedView style={styles.profileInfo}>
        <ThemedText>{user.username}</ThemedText>
        <ThemedText style={{color: fadedTextColor}}>@{user.email}</ThemedText>
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