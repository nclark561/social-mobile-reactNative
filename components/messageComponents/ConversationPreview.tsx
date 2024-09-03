import { StyleSheet, Image, useColorScheme } from 'react-native'
import React from 'react'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'

interface ConversationPreview {
    profilePic: string,
    user: string,
    timeAgo: string,
    recentMessage: string
}

interface ConversationPreviewProps {
    convo: ConversationPreview
}

export default function ConversationPreview({ convo }: ConversationPreviewProps) {
  const colorScheme = useColorScheme()

  const fadedTextColor = colorScheme === "dark" ? '#525252' : "#bebebe" 
  return (
    <ThemedView style={styles.previewContainer}>
      <Image style={styles.profilePic} source={{ uri: convo.profilePic }} />
      <ThemedView style={styles.conversationInfo}>
        <ThemedView style={{ flexDirection: 'row' }}>
            <ThemedText>{convo.user}</ThemedText>
            <ThemedText style={{ color: fadedTextColor }}> • {convo.timeAgo}</ThemedText>
        </ThemedView>
        <ThemedText style={{ color: fadedTextColor }}>{convo.recentMessage}</ThemedText>
      </ThemedView>
    </ThemedView>
  )
}

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
    conversationInfo: {
        flexDirection: 'column',
        marginLeft: 10
    }
})