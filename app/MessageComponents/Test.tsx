import React, { useContext, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MyContext from "../../components/providers/MyContext";

interface TestProps {
  conversationId: string;
  message: string;
  status: string;
  userName: string;
  recipient?: string;
  time: string;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

const Test = (props: TestProps) => {
  const navigation = useNavigation();
  const { deleteConvos, myUsername } = useContext<any>(MyContext);
  const colorScheme = useColorScheme();
  const fadedColor = colorScheme === "dark" ? '#525252' : "#bebebe";
  const color = colorScheme === "dark" ? 'white' : "black";

  // Create an Animated Value for the horizontal position
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteThreshold = -SCREEN_WIDTH / 4; // Threshold to trigger delete
  const buttonWidth = SCREEN_WIDTH / 4; // Width of the delete button

  // PanResponder to handle the swipe gesture
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) =>
      Math.abs(gestureState.dx) > 20,
    onPanResponderMove: (evt, gestureState) => {
      // Prevent swiping right
      if (gestureState.dx < 0) {
        translateX.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < deleteThreshold) {
        // Swipe is past the threshold, stay open
        Animated.timing(translateX, {
          toValue: -buttonWidth,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else {
        // Snap back to original position
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  // Function to handle delete button press
  const handleDelete = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteConvos(props.conversationId),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Delete Section */}
      <View style={styles.deleteContainer}>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={30} color="#fff" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Message Container */}
      <Animated.View
        style={[
          styles.messageContainer,
          { borderColor: fadedColor, transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <ThemedView style={styles.messageContent}>
          <View style={styles.statusDot}>
            {props.status === "Delivered" && props.userName !== myUsername ? (
              <View style={styles.blueDot}></View>
            ) : (
              <View style={styles.blueDotNothing}></View>
            )}
          </View>
          <Image
            source={{ uri: "https://ionicframework.com/docs/img/demos/avatar.svg" }}
            style={styles.userIcon}
          />
          <TouchableOpacity style={styles.messageText}>
            <ThemedView style={styles.flexTime}>
              <ThemedText style={styles.title}>
                {props.recipient === myUsername ? props.userName : props.recipient}
              </ThemedText>
              <Text style={styles.graySub}>{props.time}</Text>
              <Ionicons name="chevron-forward" size={16} color="gray" />
            </ThemedView>
            <Text style={styles.smallGray}>{props.message}</Text>
          </TouchableOpacity>
        </ThemedView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  messageContent: {
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
  deleteContainer: {
    position: "absolute",
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH / 4,
    height: "100%",
    backgroundColor: "#ff4d4d",
  },
  deleteBtn: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Test;
