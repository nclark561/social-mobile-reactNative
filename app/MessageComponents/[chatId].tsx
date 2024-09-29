import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { useNavigation, useRoute } from "@react-navigation/native"; // For navigation
import { createClient, RealtimeChannel } from "@supabase/supabase-js"; // Supabase setup
import MessageContext from "../../components/providers/MessageContext"; // Update to your actual context path
import { createId } from "@paralleldrive/cuid2"; // For creating unique IDs
import { supabase } from "../../components/Supabase";
import MyContext from "@/components/providers/MyContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";

type MessageStatus = "Delivered" | "Read";

interface Message {
  id: string;
  userName: string;
  message: string;
  status: MessageStatus;
  date: Date;
  conversationId: string
  user: any
}

interface MessageData {
  messages: Message[];
  users: any
}

interface ConvoInfo {
  id: string;
  users: [];
  me: string;
  message: { userName: string; message: string }[];
  recipient: string;
}

const CurrentChat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageData | null>(null);
  const { addMessage, myConvos } = useContext(MessageContext);
  const context = useContext<any>(MyContext);
  const { setLoginToggle, myInfo, loggedIn } = context;
  const [userName, setUserName] = useState<string | null>(myInfo?.username);
  const [info, setInfo] = useState<ConvoInfo | null>(null);
  const messagesEndRef = useRef<ScrollView | null>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const channel = useRef<RealtimeChannel | null>(null);
  const colorScheme = useColorScheme();
  const local = useLocalSearchParams<any>();

  const fadedColor = colorScheme === "dark" ? "#525252" : "#bebebe";
  const color = colorScheme === "dark" ? "white" : "black";

  useEffect(() => {
    if (!channel.current) {
      channel.current = supabase.channel(`room-${id}`, {
        config: {
          broadcast: {
            self: true,
          },
        },
      });

      channel.current
        .on(
          "broadcast",
          { event: "message" },
          ({ payload }: { payload: { message: Message } }) => {
            payload.message.date = new Date();
            payload.message.status = "Delivered";
            console.log(messages?.messages.length, "messages length");
            setMessages((prev) => {
              if(prev) return { ...prev, messages: [...prev.messages, payload.message] };
              return prev
            });

            // if (payload.message.userName !== myInfo.username) {
            //   updateMessageStatus(payload.message.id, "Read");
            // }
          }
        )
        .subscribe();
    }
    return () => {
      channel.current?.unsubscribe();
      channel.current = null;
    };
  }, [id, myInfo?.username]);

  useEffect(() => {
    // getConvoDetails();
    getConvoMessages();
  }, [local.chatId]);

  const updateMessageStatus = async (
    messageId: string,
    status: MessageStatus
  ) => {
    try {
      await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/updateMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: messageId, status }),
        }
      );
    } catch (error) {
      console.error("Failed to update message status", error);
    }
  };

  const getConvoMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/getConvo?id=${local.chatId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      setMessages(data);
      console.log(messages?.messages[0].user);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  // const getConvoDetails = async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/getSingleConvo?id=${local.chatId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     setInfo(data);
  //   } catch (error) {
  //     console.error("Failed to fetch conversation details", error);
  //   }
  // };

  const onSend = () => {
    if (!message.trim()) return;
    const messageId = createId();

    if (userName && channel.current) {
      if (!messages) return
      addMessage(messages?.messages[0].conversationId, message, myInfo.id);

      channel.current.send({
        type: "broadcast",
        event: "message",
        payload: { message: { message, user: {username: userName}, id: messageId } },
      });

      setMessage("");
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.header, { borderColor: fadedColor }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={color} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>
            {messages?.users
              ?.filter((user: any) => user.user.id !== myInfo.id)
              .map((user: any) => user?.user.username)}
          </ThemedText>
        </ThemedView>

        <ScrollView ref={messagesEndRef} style={styles.messagesContainer}>
          {messages?.messages?.map((msg, i) => (
            <ThemedView
              key={`${msg.id}-${i}`}
              style={
                userName === msg.user.username
                  ? styles.myMessage
                  : styles.otherMessage
              }
            >
              <ThemedText style={styles.messageText}>{msg.message}</ThemedText>
            </ThemedView>
          ))}
        </ScrollView>

        <ThemedView
          style={[styles.inputContainer, { borderColor: fadedColor }]}
        >
          <TextInput
            style={[styles.input, { borderColor: fadedColor, color }]}
            placeholder="Type your message"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={onSend}
          />
          <TouchableOpacity onPress={onSend} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d1e7ff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  messageText: {
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
  },
  input: {
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

export default CurrentChat;
