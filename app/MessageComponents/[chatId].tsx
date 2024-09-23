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
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { useNavigation, useRoute } from "@react-navigation/native"; // For navigation
import { createClient, RealtimeChannel } from "@supabase/supabase-js"; // Supabase setup
import { MessageContext } from "../../components/providers/MessageContext"; // Update to your actual context path
import { createId } from "@paralleldrive/cuid2"; // For creating unique IDs
import { supabase } from "../../components/Supabase";
import MyContext from "@/components/providers/MyContext";


type MessageStatus = "Delivered" | "Read";

interface Message {
    id: string;
    userName: string;
    message: string;
    status: MessageStatus;
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
    const [messages, setMessages] = useState<Message[]>([]);
    const { myUsername, addMessage, myConvos } = useContext(MessageContext);
    const context = useContext<any>(MyContext);
    const { setLoginToggle, myInfo, loggedIn } = context;
    const [userName, setUserName] = useState<string | null>(
        myInfo.username
    );
    const [info, setInfo] = useState<ConvoInfo | null>(null);
    const messagesEndRef = useRef<ScrollView | null>(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params as { id: string };
    const channel = useRef<RealtimeChannel | null>(null);

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
                .on("broadcast", { event: "message" }, ({ payload }: any) => {
                    payload.message.date = new Date();
                    payload.message.status = "Delivered";
                    setMessages((prevMessages) => [...prevMessages, payload.message]);
                    if (payload.message.userName !== myUsername) {
                        updateMessageStatus(payload.message.id, "Read");
                    }
                })
                .subscribe();
        }
        return () => {
            channel.current?.unsubscribe();
            channel.current = null;
        };
    }, [id, myUsername]);

    useEffect(() => {
        getConvoDetails();
        getConvoMessages();
    }, [id]);

    const updateMessageStatus = async (messageId: string, status: MessageStatus) => {
        try {
            await fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/updateMessage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: messageId, status }),
            });
        } catch (error) {
            console.error("Failed to update message status", error);
        }
    };

    const getConvoMessages = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/getConvo?id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setMessages(data.Posts);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const getConvoDetails = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/getSingleConvo?id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setInfo(data.Posts);
        } catch (error) {
            console.error("Failed to fetch conversation details", error);
        }
    };

    const onSend = () => {
        if (!message.trim()) return;

        const messageId = createId();
        const recipient = myUsername === info?.recipient ? info.me : info?.recipient;

        if (userName && recipient && channel.current) {
            addMessage(messageId, id, message, userName, "Delivered", recipient);

            channel.current.send({
                type: "broadcast",
                event: "message",
                payload: { message: { message, userName, id: messageId } },
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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {myInfo.username === info?.me ? info?.recipient : info?.me}
                </Text>
            </View>

            <ScrollView ref={messagesEndRef} style={styles.messagesContainer}>
                {messages.map((msg, i) => (
                    <View
                        key={`${msg.id}-${i}`}
                        style={userName === msg.userName ? styles.myMessage : styles.otherMessage}
                    >
                        <Text style={styles.messageText}>{msg.message}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message"
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={onSend}
                />
                <TouchableOpacity onPress={onSend} style={styles.sendButton}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
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
        borderTopColor: "#ddd",
    },
    input: {
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

export default CurrentChat;
