import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Replaces ionicons
import { useNavigation } from "@react-navigation/native"; // Replaces useHistory
import { createClient, RealtimeChannel } from "@supabase/supabase-js"; // Ensure Supabase is installed
import MessageContext from "../../components/providers/MessageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyContext from "@/components/providers/MyContext";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

type User = {
  id: string;
  username: string
};

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const navigation = useNavigation(); // Replaces useHistory
  const [recipientSearch, setRecipientSearch] = useState("");
  const [recipient, setRecipient] = useState<User | undefined>();
  const context = useContext<any>(MyContext);
  const { setLoginToggle, myInfo, loggedIn } = context;
  const colorScheme = useColorScheme();
  const [toggleList, setToggleList] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);

  const fadedColor = colorScheme === "dark" ? "#525252" : "#bebebe";
  const color = colorScheme === "dark" ? "white" : "black";

  const handlePickUser = (user: User) => {
    console.log('hitting pick user')
    setRecipient(user)
    setRecipientSearch(user.username)
    setToggleList(false)
  }

  const createConversation = async () => {
    try {
      if (!myInfo.id || !recipient?.id) throw new Error("User missing");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/createConversation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            myId: myInfo.id,
            recipientId: recipient.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      router.navigate(`/MessageComponents/${data.update.id}`);
      setMessage("");
      setRecipientSearch("");
      setRecipient(undefined);
      setSearchResults(null)
    } catch (error) {
      console.error("Failed to create conversation", error);
    }
  };

  const searchUsers = async () => {
    try {
      const result = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/searchUsers?username=${recipientSearch}`
      );
      const users = await result.json();
      console.log(users);
      setSearchResults(users.user);
    } catch (err) {
      console.log("oops");
    }
  };

  useEffect(() => {
    if (recipientSearch.length > 0) searchUsers();
  }, [recipientSearch]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { borderColor: fadedColor }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={color} />
        </TouchableOpacity>
        <TextInput
          style={[styles.recipientInput, { borderColor: fadedColor, color }]}
          onChangeText={(text) => setRecipientSearch(text)}
          value={recipientSearch}
          placeholder="Who to?"
          onFocus={() => setToggleList(true)}
          // onBlur={() => setToggleList(false)}
        />
      </ThemedView>
      {toggleList && (
        <ThemedView style={[styles.userList, { borderColor: fadedColor }]}>
          <ScrollView style={styles.usersView}>
            {searchResults?.length > 0 ? (
              searchResults.map((e: any) => (
                <Pressable style={styles.border} onPress={() => handlePickUser(e)}>
                  <ThemedText style={styles.user} key={e.id}>
                    {e.username}
                  </ThemedText>
                </Pressable>
              ))
            ) : (
              <ThemedText>No users found</ThemedText>
            )}
          </ScrollView>
        </ThemedView>
      )}
      <ScrollView style={styles.messagesContainer}></ScrollView>
      <ThemedView style={[styles.inputArea, { borderColor: fadedColor }]}>
        <TextInput
          style={[styles.textInput, { borderColor: fadedColor, color }]}
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type a message"
          onSubmitEditing={createConversation}
        />
        <TouchableOpacity
          onPress={createConversation}
          style={styles.sendButton}
        >
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
    alignItems: "center",
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
  userList: {
    maxHeight: "35%",
    width: "75%",
    borderColor: "white",
    borderWidth: 0.5,
    top: -11,
  },
  user: {},
  usersView: {
    flexDirection: "column",
    height: 50 
  },
  border: {
    backgroundColor: 'black'
  }
});

export default Chat;
