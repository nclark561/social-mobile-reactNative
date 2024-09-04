import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/Header";
import ConversationPreview from "@/components/messageComponents/ConversationPreview";
import Animated from "react-native-reanimated";
import { router } from "expo-router";

const conversation1 = {
  conversationId: '1234',
  profilePic: "https://avatars.githubusercontent.com/u/125314332?v=4",
  user: 'Noah Clark',
  timeAgo: '18h',
  recentMessage: 'Yo whats going on dude?'
}

const conversations = [ conversation1, conversation1, conversation1, conversation1, conversation1, conversation1, conversation1, conversation1, conversation1, conversation1, conversation1]

export default function messages() {
  const handleNavigate = (route: string) => router.navigate(`/(tabs)/${route}`)
  
  return (
    <ThemedView>
        <Header name='Messages'/>
        <Animated.ScrollView>
          {conversations.map((e, i) => (
            <Pressable key={i} onPress={() => handleNavigate(e.conversationId)}>
              <ConversationPreview convo={e}/> 
            </Pressable>
          ))}
        </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
});
