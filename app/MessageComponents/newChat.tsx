import React, { useState, useEffect, useRef, useContext } from "react";
import { View, TextInput, Button, Text, ScrollView, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Replaces ionicons
import { useNavigation } from "@react-navigation/native"; // Replaces useHistory
import { createClient, RealtimeChannel } from "@supabase/supabase-js"; // Ensure Supabase is installed
import MessageContext from "../../components/providers/MessageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyContext from "@/components/providers/MyContext";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";


type Message = {
  userName: string;
  message: string;
  date: Date;
};

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const channel = useRef<RealtimeChannel | null>(null);
  const {  person, setPerson, getConvos, addMessage } = useContext(MessageContext);
  const navigation = useNavigation(); // Replaces useHistory
  const [recipient, setRecipient] = useState<string | undefined>();
  const context = useContext<any>(MyContext);
  const { setLoginToggle, myInfo, loggedIn } = context;
  const [userName, setUserName] = useState<string | null>(myInfo.username);
  const [roomName, setRoomName] = useState<string>("");
  const colorScheme = useColorScheme()

  const fadedColor = colorScheme === "dark" ? '#525252' : "#bebebe"
  const color = colorScheme === "dark" ? 'white' : "black"

  useEffect(() => {
    setRoomName(`${myInfo.username}${recipient}`);
  }, [recipient]);

  useEffect(() => {
    if (messages.length === 1) {
      createConversation();
    }
  }, [messages]);


  const createConversation = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/createConversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: {
            message,
            userName,
            recipient,
          },
          me: myInfo.username,
          roomName: `${myInfo.username}${recipient}`,
          recipient,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      router.navigate(`/MessageComponents/${data.update.id}`);
      setMessage("");
      setRecipient("");
    } catch (error) {
      console.error("Failed to create conversation", error);
    }
  };


  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { borderColor: fadedColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={color} />
        </TouchableOpacity>
        <TextInput
          style={[styles.recipientInput, { borderColor: fadedColor, color }]}
          onChangeText={(text) => setRecipient(text)}
          value={recipient}
          placeholder="Who to?"
        />
      </ThemedView>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={myInfo.username === msg.userName ? styles.myMessage : styles.otherMessage}>
            <Text style={styles.messageText}>
              {messages[index - 1]?.userName === msg.userName ? "" : `${msg.userName}: `}
              {msg.message}
            </Text>
          </View>
        ))}
      </ScrollView>
      <ThemedView style={[styles.inputArea, { borderColor: fadedColor }]}>
        <TextInput
          style={[styles.textInput, { borderColor: fadedColor, color }]}
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type a message"
          onSubmitEditing={createConversation}
        />
        <TouchableOpacity onPress={createConversation} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 10,
  },
  recipientInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d1e7ff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    maxWidth: "80%",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    maxWidth: "80%",
  },
  messageText: {
    color: "#333",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
});

export default Chat;
