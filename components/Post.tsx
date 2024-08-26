import { StyleSheet, Image } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "react-native";
import { useState } from "react";

interface Post {
  user: string;
  profilePic: string;
  text: string;
}

export default function Post({ post }: { post: Post }) {
  const colorScheme = useColorScheme();
  const [liked, setLiked] = useState(false);

  const likePost = () => {
    setLiked((prev) => !prev);
  };

  return (
    <ThemedView
      style={[
        styles.postContainer,
        colorScheme === "dark"
          ? { borderColor: "#525252" }
          : { borderColor: "#bebebe" },
      ]}
    >
      <ThemedView style={styles.flex}>
        <Image style={styles.profilePic} source={{ uri: post.profilePic }} />
        <ThemedText style={styles.postUser}>{post.user}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.postContent}>
        <ThemedText style={styles.postText}>{post.text}</ThemedText>
        <ThemedView style={styles.reactionsContainer}>
          <Ionicons
            size={20}
            name="chatbubble-outline"
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Ionicons
            size={20}
            name="git-compare-outline"
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Ionicons
            size={20}
            name={liked ? "heart" : "heart-outline"}
            onPress={likePost}
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Ionicons
            size={20}
            name="share-outline"
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </ThemedView>
      </ThemedView>
      <Ionicons
        size={20}
        name="ellipsis-horizontal"
        style={styles.ellipsis}
        color={colorScheme === "dark" ? "white" : "black"}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    flexDirection: "column",
    width: "100%",
    borderBottomWidth: 0.5,
    paddingBottom: 2,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    borderRadius: 25,
    width: 25,
    height: 25,
    marginTop: 6,
    marginHorizontal: 10,
  },
  postContent: {
    flexDirection: "column",
    paddingVertical: 8,
    flexShrink: 1,
    margin: 10,
  },
  postUser: {
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 2,
  },
  postText: {
    flexShrink: 1,
  },
  ellipsis: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  reactionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  smallWidth: {
    width: 40,
  },
});
