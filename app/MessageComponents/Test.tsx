import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useColorScheme,
  Pressable
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import MyContext from "../../components/providers/MyContext";
import { router } from "expo-router";

interface TestProps {
  conversationId: string;
  message: string;
  status: string;
  user: any;
  recipient?: string;
  time: string;
}

const Test = (props: TestProps) => {
  const { myUsername } = useContext<any>(MyContext);
  const colorScheme = useColorScheme();
  const [ imageUri, setImageUri ] =  useState(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${props.user.id}.jpg?${Date.now()}`)
  const fadedColor = colorScheme === "dark" ? '#525252' : "#bebebe";
  const color = colorScheme === "dark" ? 'white' : "black";

  const mortyUrl = 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg';
  const handleError = () => setImageUri(mortyUrl);

  const navigateToConversation = () => {
    router.push(`/MessageComponents/${props.conversationId}`);
  };

  return (
    <Pressable onPress={navigateToConversation} style={styles.messageContent}>
      <View style={styles.statusDot}>
        {props.status === "Delivered" && props.user.username !== myUsername ? (
          <View style={styles.blueDot}></View>
        ) : (
          <View style={styles.blueDotNothing}></View>
        )}
      </View>
      <Image
        source={{ uri: imageUri }} 
        onError={handleError}
        style={styles.userIcon}
      />
      <View style={styles.messageText}>
        <ThemedView style={styles.flexTime}>
          <ThemedText style={styles.title}>
            {props.recipient === myUsername ? props.user.username : props.recipient}
          </ThemedText>
          <Text style={styles.graySub}>{props.time}</Text>
          <Ionicons name="chevron-forward" size={16} color="gray" />
        </ThemedView>
        <Text style={styles.smallGray}>{props.message}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  messageContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  statusDot: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  blueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#26a7de",
  },
  blueDotNothing: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "transparent",
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  messageText: {
    flex: 1,
    paddingVertical: 10,
  },
  flexTime: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontWeight: "bold",
    flex: 1,
  },
  graySub: {
    color: "gray",
    marginHorizontal: 10,
  },
  smallGray: {
    color: "gray",
  },
  deleteBtn: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    position: "absolute",
    right: 10,
    height: "80%",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Test;
