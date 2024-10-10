import React, { useState, useEffect, useContext, useRef } from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  PanResponder,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Test from "../../MessageComponents/Test";
import MyContext from "@/components/providers/MyContext";
import { router, useFocusEffect } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import MessageContext from "@/components/providers/MessageContext";
import DesktopRouting from "@/components/desktopComponents/desktopRouting";
import StackLogos from "@/components/desktopComponents/stackLogos";
import DesktopSuggestedProfiles from "@/components/desktopComponents/desktopSuggestedProfiles";
import Projects from "@/components/desktopComponents/projects";

const SCREEN_WIDTH = Dimensions.get("window").width;

const MessageHome: React.FC = () => {
  const { deleteConvos, myUsername, getConvos, setMyConvos, myConvos } =
    useContext<any>(MessageContext);
  const context = useContext<any>(MyContext);
  const { myInfo } = context;
  const colorScheme = useColorScheme();
  const fadedColor = colorScheme === "dark" ? "#525252" : "#bebebe";

  useFocusEffect(() => {
    const intervalId = setInterval(getConvos, 2000);
    return () => clearInterval(intervalId);
  });

  const handleDelete = (conversationId: string) => {
    setMyConvos((prevData: any) =>
      prevData.filter((item: any) => item.id !== conversationId),
    );
    deleteConvos(conversationId);
  };

  const renderItem = ({ item }: { item: ConversationData }) => {
    return <SwipeableItem item={item} onDelete={() => handleDelete(item.id)} />;
  };

  return (
    <ThemedView style={styles.pageContainer}>
      <ThemedView style={styles.desktopCenter}>
        <ThemedView style={styles.desktopRow}>          
          <ThemedView style={styles.mainContent}>
            <ThemedView style={[styles.header, { borderColor: fadedColor }]}>
              <ThemedText style={styles.title}>Messages</ThemedText>
            </ThemedView>
            <FlatList
              data={myConvos}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
            />
            <ThemedView style={styles.center}>
              {myConvos?.length > 1 ? null : (
                <ThemedText>Create A Message</ThemedText>
              )}
              <TouchableOpacity
                onPress={() => router.navigate("/MessageComponents/newChat")}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={32}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const SwipeableItem = ({
  item,
  onDelete,
}: {
  item: ConversationData;
  onDelete: () => void;
}) => {
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
          key={item?.id}
          time={item?.messages[0]?.date}
          conversationId={item?.id}
          message={item?.messages[0].message}
          messageUser={item?.messages[0].userId}
          status={item?.messages[0].status}
          user={item?.users[0].user}
        />
      </ThemedView>
    </Animated.View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  pageContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    paddingTop: 20,
  },
  desktopCenter: {
    width: width > 600 ? '80%' : '100%',
  },
  desktopRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    width: width > 600 ? '100%' : '100%',
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
    textAlign: "center",
  },
  center: {
    display: "flex",
    justifyContent: "center",
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
    ...(Platform.OS === 'web' && {
      padding: 5
    }),
  },
  list: {},
  desktopHiddenBorder: {
    display: width > 600 ? 'flex' : 'none',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: 'rgb(232,232,232)',
    borderRadius: 10,
    padding: 15,
  },
});

export default MessageHome;
