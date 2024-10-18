import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  PanResponder,
  Animated,
  Dimensions,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Test from "../../MessageComponents/Test";
import MyContext from "@/components/providers/MyContext";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { DrawerActions } from "@react-navigation/native";
import { Image } from "expo-image";
import MessageContext from "@/components/providers/MessageContext";
import AnimatedUnderlineText from "@/components/desktopComponents/animatedUnderlineText";

const SCREEN_WIDTH = Dimensions.get("window").width;

const MessageHome: React.FC = () => {
  const { deleteConvos, myUsername, getConvos, setMyConvos, myConvos } =
    useContext<any>(MessageContext);
  const context = useContext<any>(MyContext);
  const navigation = useNavigation();
  const { myInfo, loggedIn } = context;
  const colorScheme = useColorScheme();
  const fadedColor = colorScheme === "dark" ? "#525252" : "#bebebe";
  const handlePress = () => navigation.dispatch(DrawerActions.openDrawer());
  const mortyUrl =
    "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";
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

  const profileImageUri = useMemo(() => {
    if (myInfo?.id) {
      return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo.id}?${Date.now()}`;
    }
    return mortyUrl; // Fallback URL
  }, [myInfo?.id]);

  const blurhash = myInfo?.blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe";

  const renderItem = ({ item }: { item: any }) => {
    return <SwipeableItem item={item} onDelete={() => handleDelete(item.id)} />;
  };

  return (
    <ThemedView style={styles.pageContainer}>
      <ThemedView style={styles.desktopCenter}>
        <ThemedView style={styles.desktopRow}>
          <ThemedView style={styles.mainContent}>
            <ThemedView style={[styles.header, { borderColor: fadedColor }]}>
                {loggedIn ? (
                  <Pressable onPress={handlePress}>
                    <Image
                      style={styles.profilePic}
                      source={{ uri: profileImageUri }}
                      placeholder={{ blurhash }}
                    />
                  </Pressable>
                ) : (
                  <Pressable onPress={() => router.navigate("/login")}>
                    <AnimatedUnderlineText style={{ marginLeft: 5 }}>Login</AnimatedUnderlineText>
                  </Pressable>
                )}              
              <ThemedText style={styles.title}>Messages</ThemedText>
              <ThemedView></ThemedView>
            </ThemedView>
            <FlatList
              data={myConvos}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
            />
            <ThemedView style={styles.center}>
              {myConvos?.length > 1 ? null : (
                <ThemedText>{loggedIn ? 'Create a message' : 'Login to create a message'}</ThemedText>
              )}
              {loggedIn ? <TouchableOpacity
                onPress={() => router.navigate("/MessageComponents/newChat")}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={32}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </TouchableOpacity> : <TouchableOpacity
              >
                <Ionicons
                  name="add-circle-outline"
                  size={32}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </TouchableOpacity>}

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
  item: any;
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
    display: "flex",
    alignItems: "center",
    flex: 1,
    paddingTop: 20,
  },
  desktopCenter: {
    width: width > 600 ? "80%" : "100%",
  },
  desktopRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  profilePic: {
    borderRadius: 15,
    width: 35,
    height: 35,
  },
  mainContent: {
    width: width > 600 ? "100%" : "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    ...(Platform.OS === "web" && {
      padding: 5,
    }),
  },
  list: {},
  desktopHiddenBorder: {
    display: width > 600 ? "flex" : "none",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "rgb(232,232,232)",
    borderRadius: 10,
    padding: 15,
  },
});

export default MessageHome;
