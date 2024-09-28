import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Pressable,
  PanResponder,
  Animated,
  Dimensions,
  Text
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Test from "../MessageComponents/Test";
import MyContext from "@/components/providers/MyContext";
import { router, useFocusEffect } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import MessageContext from "@/components/providers/MessageContext";

interface MessageData {
  conversationId: string;
  date: string;
  id: string;
  message: string;
  status: string;
  userName: string;
  recipient?: string;
  time: any
}

interface User {
  id: string,
  username: string,
}

interface UserData {
  user: User
}

interface ConversationData {
  id: string,
  date: Date,
  users: UserData[],
  messages: MessageData[]
}

const SCREEN_WIDTH = Dimensions.get("window").width;

const MessageHome: React.FC = () => {
  const [myConvos, setMyConvos] = useState<ConversationData[]>([]);
  const { deleteConvos, myUsername } = useContext<any>(MessageContext);
  const navigation = useNavigation();
  const context = useContext<any>(MyContext);
  const { myInfo } = context;
  const colorScheme = useColorScheme();
  const fadedColor = colorScheme === "dark" ? '#525252' : "#bebebe";
  const deleteThreshold = -SCREEN_WIDTH / 3; // Threshold for deleting an item

  useEffect(() => {
    getConvos(); 
  }, []);

  const getConvos = async () => {    
    try {
      const convos = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/getConvos?id=${myInfo.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { conversations } = await convos.json();
      setMyConvos(conversations);
      console.log(conversations[0].users[0].user, 'this is the recipient')
    } catch (error) {
    }
  };

  useFocusEffect(() => {
    const intervalId = setInterval(getConvos, 5000);
    return () => clearInterval(intervalId);
  });

  const handleDelete = (conversationId: string) => {
    setMyConvos((prevData) => prevData.filter((item) => item.id !== conversationId));
    deleteConvos(conversationId)
  };

  const renderItem = ({ item }: { item: ConversationData }) => {
    return (
      <SwipeableItem
        item={item}
        onDelete={() => handleDelete(item.id)}
      />
    );
  };



  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { borderColor: fadedColor }]}>
        <ThemedText style={styles.title}>{myInfo?.username}</ThemedText>
      </ThemedView>
      <FlatList
        data={myConvos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <ThemedView style={styles.center}>
        {myConvos?.length > 1 ? null : <ThemedText>Create A Message</ThemedText>}
        <TouchableOpacity onPress={() => router.navigate("/MessageComponents/newChat")}>
          <Ionicons name="add-circle-outline" size={32} color={colorScheme === 'dark' ? 'white' : 'black'} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const SwipeableItem = ({ item, onDelete }: { item: ConversationData, onDelete: () => void }) => {
  
  const translateX = useRef(new Animated.Value(0)).current;
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) =>
      Math.abs(gestureState.dx) > 20,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < 0) {
        translateX.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -SCREEN_WIDTH / 3) {
        Animated.timing(translateX, {
          toValue: -SCREEN_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onDelete());
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <Animated.View
      style={[styles.animatedItem, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      <ThemedView style={styles.itemContainer}>
        <Test
          key={item.id}
          time={item?.messages[0]?.time}
          conversationId={item.id}
          message={item.messages[0].message}
          status={item.messages[0].status}
          user={item.users[0].user}
        />
      </ThemedView>
    </Animated.View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: 'center'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: "center",
    marginVertical: 20,
  },
  animatedItem: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  list: {}
});

export default MessageHome;
