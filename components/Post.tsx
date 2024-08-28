import { StyleSheet, Image, Button, Pressable, Text } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "react-native";
import { useState, useRef } from "react";
import CustomBottomSheet from "./util/CustomBottomSheet";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";

interface Post {
  user: string;
  profilePic: string;
  text: string;
}

export default function Post({ post }: { post: Post }) {
  const colorScheme = useColorScheme();
  const [liked, setLiked] = useState(false);

  const shareModalRef = useRef<BottomSheetModal>(null)
  const commentModalRef = useRef<BottomSheetModal>(null)

  const handleOpenShare = () => shareModalRef.current?.present()
  const handleOpenComment = () => commentModalRef.current?.present()
  const handleCloseComment = () => commentModalRef.current?.dismiss()

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
            onPress={handleOpenComment}
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
            onPress={handleOpenShare}
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
      <CustomBottomSheet snapPercs={['25%']} ref={shareModalRef} title="share">
        <ThemedView style={styles.shareContainer}>
          <ThemedView style={styles.shareOption}>
            <Ionicons size={20} name="mail-outline" color={colorScheme === "dark" ? "white" : "black"}></Ionicons>
            <ThemedText>Send via Direct Message</ThemedText>
          </ThemedView>
          <ThemedView style={styles.shareOption}>
            <Ionicons size={20} name="copy-outline" color={colorScheme === "dark" ? "white" : "black"}></Ionicons>
            <ThemedText>Copy Link</ThemedText>
          </ThemedView>
        </ThemedView>
      </CustomBottomSheet>
      <CustomBottomSheet snapPercs={['70%']} ref={commentModalRef} hideCancelButton>
        <ThemedView style={styles.commentContainer}>
          <ThemedView style={styles.buttonContainer}>
            <Button title="Cancel" onPress={handleCloseComment}></Button>
            <Pressable style={styles.postButton}>
              <Text style={styles.buttonText}>Post</Text>
            </Pressable>
          </ThemedView>
          <BottomSheetTextInput autoFocus placeholder="Post your reply"></BottomSheetTextInput>
        </ThemedView>
      </CustomBottomSheet>
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
  shareContainer: {
    flexDirection: 'column',
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 5
  },
  commentContainer: {
    flexDirection: 'column',
    paddingTop: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10
  },
  postButton: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#26a7de',
  },
  buttonText: {
    color: 'white'
  }
});
