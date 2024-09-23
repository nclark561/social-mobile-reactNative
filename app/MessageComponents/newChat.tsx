import React, { useState, useEffect, useRef, useContext } from "react";
import { View, TextInput, Button, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Replaces ionicons
import { useNavigation } from "@react-navigation/native"; // Replaces useHistory
import { createClient, RealtimeChannel } from "@supabase/supabase-js"; // Ensure Supabase is installed
import { MessageContext } from "../../components/providers/MessageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyContext from "@/components/providers/MyContext";
import { router } from "expo-router";


type Message = {
  userName: string;
  message: string;
  date: Date;
};

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const channel = useRef<RealtimeChannel | null>(null);
  const { myUsername, person, setPerson, getConvos, addMessage } = useContext(MessageContext);
  const navigation = useNavigation(); // Replaces useHistory
  const [recipient, setRecipient] = useState<string | undefined>();
  const context = useContext<any>(MyContext);
  const { setLoginToggle, myInfo, loggedIn } = context;
  const [userName, setUserName] = useState<string | null>(myInfo.username);
  const [roomName, setRoomName] = useState<string>("");

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.recipientInput}
          onChangeText={(text) => setRecipient(text)}
          value={recipient}
          placeholder="Who to?"
        />
      </View>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={myUsername === msg.userName ? styles.myMessage : styles.otherMessage}>
            <Text style={styles.messageText}>
              {messages[index - 1]?.userName === msg.userName ? "" : `${msg.userName}: `}
              {msg.message}
            </Text>
          </View>
        ))}
      </ScrollView>      
      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type a message"
          onSubmitEditing={createConversation}
        />
        <TouchableOpacity onPress={createConversation} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    marginRight: 10,
  },
  recipientInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
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
    borderTopColor: "#ddd",
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
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
