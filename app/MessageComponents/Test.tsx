import React, { useContext } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,    
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti"; // Use Moti for animations
import MyContext  from "../../components/providers/MyContext"; 

interface TestProps {
    conversationId: string;
    message: string;
    status: string;
    userName: string;
    recipient?: string;
    time: string;
}

const Test = (props: TestProps) => {
    const navigation = useNavigation();
    const { deleteConvos, myUsername } = useContext(MyContext);

    const DELETE_BTN_WIDTH = 15;

    //   const gotoTopic = (topicId: string) => {
    //     navigation.navigate("Chat", { topicId }); // Adapt navigation to match your screen names
    //   };

    const handleDragEnd = (dragX: number, messageId: string) => {
        if (dragX < DELETE_BTN_WIDTH) {
            deleteConvos(messageId);
        }
    };

    return (
        <MotiView
            from={{ opacity: 1, height: 100 }}
            animate={{ opacity: 1, height: 100 }}
            exit={{ opacity: 0, height: 0 }}
            style={styles.messageContainer}
        >
            <ThemedText>kale</ThemedText>
            <View
                style={styles.msgContainer}
                onStartShouldSetResponder={() => true}
                onResponderMove={(e) => {
                    const dragDistance = e.nativeEvent.pageX;
                    handleDragEnd(dragDistance, props.conversationId);
                }}
            >
                <View style={styles.statusDot}>
                    {props.status === "Delivered" && props.userName !== myUsername ? (
                        <View style={styles.blueDot}></View>
                    ) : (
                        <View style={styles.blueDotNothing}></View>
                    )}
                </View>
                <Image
                    source={{
                        uri: "https://ionicframework.com/docs/img/demos/avatar.svg",
                    }}
                    style={styles.userIcon}
                />
                <TouchableOpacity
                    // onPress={() => gotoTopic(props.conversationId)}
                    style={styles.messageText}
                >
                    <View style={styles.flexTime}>
                        <Text style={styles.title}>
                            {props.recipient === myUsername ? props.userName : props.recipient}
                        </Text>
                        <Text style={styles.graySub}>{props.time}</Text>
                        <Ionicons name="chevron-forward" size={16} color="gray" />
                    </View>
                    <Text style={styles.smallGray}>{props.message}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                    Alert.alert("Delete", "Are you sure you want to delete this message?", [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Delete",
                            onPress: () => deleteConvos(props.conversationId),
                            style: "destructive",
                        },
                    ])
                }
            >
                <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    msgContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
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
        backgroundColor: "blue",
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
    },
    deleteText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default Test;
