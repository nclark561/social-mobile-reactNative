import { StyleSheet, Image, Button, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useContext, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import PostContext from "../../components/providers/PostContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "react-native";
import { useState, useRef } from "react";
import CustomBottomSheet from "@/components/util/CustomBottomSheet";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Link } from "expo-router";
import Post from "@/components/postComponents/Post";
import CommentBottomSheet from "@/components/postComponents/CommentBottomSheet";

interface Post {
  id: string;
  content: string;
  date: Date;
  replies: any;
  email: string;
  profilePic: string;
  username: string;
}

export default function CommentPage() {
  const colorScheme = useColorScheme();
  const [liked, setLiked] = useState(false);
  const [thisPost, setThisPost] = useState<any>();
  const [commentInput, setCommentInput] = useState("");
  const { getForYouPosts } = useContext<any>(PostContext);
  const shareModalRef = useRef<BottomSheetModal>(null);
  const commentModalRef = useRef<BottomSheetModal>(null);
  const repostModalRef = useRef<BottomSheetModal>(null);
  const local = useLocalSearchParams();
  console.log(local, "this is the local")

  const fadedTextColor = colorScheme === "dark" ? "#525252" : "#bebebe";

  const handleOpenShare = () => shareModalRef.current?.present();
  const handleOpenComment = () => commentModalRef.current?.present();
  const handleCloseComment = () => commentModalRef.current?.dismiss();
  const handleOpenRepost = () => repostModalRef.current?.present();

  const likePost = () => {
    setLiked((prev) => !prev);
  };

  // const isLikedByUser = (likes: string[]): boolean => {
  //   return likes.includes(myInfo?.id);
  // };

  

  const addLike = async (userId: string, postId: string) => {
    console.log(postId, "hitting add like");
    try {
      const test = await fetch(
        `https://${process.env.EXPO_PUBLIC_SERVER_BASE_URL}.ngrok-free.app/api/addLike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            postId,
          }),
        }
      );
      await getForYouPosts();
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const addComment = async (
    comment: string,
    userName: string,
    postId: string,
    userId: string,
    commentId?: string
  ) => {
    try {
      const response = await fetch(
        `https://${process.env.EXPO_PUBLIC_SERVER_BASE_URL}.ngrok-free.app/api/addComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment,
            userName,
            postId,
            userId,
            commentId,
          }),
        }
      );
      const post = await response.json();
      console.log(post, "this is the comment response");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getPost = async () => {
    try {
      const result = await fetch(
        `https://${process.env.EXPO_PUBLIC_SERVER_BASE_URL}.ngrok-free.app/api/getSingleComment?id=${local.comment}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const userData = await result.json();
      console.log(userData.comment, "this is this comment data");
      setThisPost(userData.comment);
    } catch (error) {
      console.log(error, "this is the get user error");
    }
  };

  useFocusEffect(() => {
      getPost();
  });

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView
        style={[
          styles.mainPostContainer,
          colorScheme === "dark"
            ? { borderColor: "#525252" }
            : { borderColor: "#bebebe" },
        ]}
      >
        <Pressable>
          <Link href="/(tabs)/">
            <Ionicons
              size={20}
              name="arrow-back-outline"
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </Link>
        </Pressable>
        <ThemedView style={styles.postContent}>
          <ThemedView style={[styles.row, { marginBottom: 20 }]}>
            <ThemedView style={styles.flex}>
              <Image
                style={styles.mainProfilePic}
                source={{
                  uri: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
                }}
              />
            </ThemedView>
            <Link href={`/profile/${thisPost?.email}`}>
              <ThemedText style={styles.postUser}>
                {thisPost?.userName}
              </ThemedText>
            </Link>
          </ThemedView>
          <ThemedText style={styles.mainPostText}>
            {thisPost?.content}
          </ThemedText>
          <ThemedView style={styles.reactionsContainer}>
            <ThemedView style={styles.smallRow}>
              <Ionicons
                size={15}
                name="chatbubble-outline"
                onPress={handleOpenComment}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <ThemedText style={styles.smallNumber}>
                {thisPost?.replies?.length}
              </ThemedText>
            </ThemedView>
            <Ionicons
              size={15}
              name="git-compare-outline"
              onPress={handleOpenRepost}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <ThemedView style={styles.smallRow}>
              <Ionicons
                size={15}
                name="heart-outline"
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <ThemedText style={styles.smallNumber}>{0}</ThemedText>
            </ThemedView>
            <Ionicons
              size={15}
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
        <CustomBottomSheet
          snapPercs={["25%"]}
          ref={shareModalRef}
          title="Share"
        >
          <ThemedView style={styles.shareContainer}>
            <ThemedView style={styles.shareOption}>
              <Ionicons
                size={25}
                name="mail-outline"
                color={colorScheme === "dark" ? "white" : "black"}
              ></Ionicons>
              <ThemedText style={styles.optionText}>
                Send via Direct Message
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.shareOption}>
              <Ionicons
                size={25}
                name="copy-outline"
                color={colorScheme === "dark" ? "white" : "black"}
              ></Ionicons>
              <ThemedText style={styles.optionText}>Copy Link</ThemedText>
            </ThemedView>
          </ThemedView>
        </CustomBottomSheet>
        <CommentBottomSheet commentModalRef={commentModalRef} post={thisPost} isComment/>
        <CustomBottomSheet snapPercs={["20%"]} ref={repostModalRef}>
          <ThemedView
            style={[styles.shareContainer, { marginBottom: 30, height: "75%" }]}
          >
            <ThemedView style={[styles.shareOption, { marginTop: 10 }]}>
              <Ionicons
                size={25}
                name="git-compare-outline"
                color={colorScheme === "dark" ? "white" : "black"}
              ></Ionicons>
              <ThemedText style={styles.optionText}>Repost</ThemedText>
            </ThemedView>
            <ThemedView style={[styles.shareOption, { marginTop: 10 }]}>
              <Ionicons
                size={25}
                name="pencil-outline"
                color={colorScheme === "dark" ? "white" : "black"}
              ></Ionicons>
              <ThemedText style={styles.optionText}>Quote</ThemedText>
            </ThemedView>
          </ThemedView>
        </CustomBottomSheet>
      </ThemedView>
      {thisPost?.replies.map((comment: any) => {
        return <Post key={comment.id} isComment post={comment} />;
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainPostContainer: {
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 0.3,
    paddingBottom: 2,
  },
  flex: {
    flexDirection: "row",
    height: "35%",
    // alignItems: "center",
  },
  mainProfilePic: {
    borderRadius: 25,
    width: 45,
    height: 45,
    marginHorizontal: 10,
  },
  postContent: {
    flexDirection: "column",
    paddingVertical: 10,
    flexShrink: 1,
    margin: 5,
  },
  postUser: {
    fontWeight: "bold",
    fontSize: 15,
    paddingBottom: 2,
  },
  mainPostText: {
    fontSize: 16,
    flexShrink: 1,
    margin: 10,
  },
  ellipsis: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  reactionsContainer: {
    flexDirection: "row",
    width: "95%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  shareContainer: {
    flexDirection: "column",
    width: "100%",
  },
  shareOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    width: "100%",
    height: "40%",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 18,
  },
  commentContainer: {
    flexDirection: "column",
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
  },
  commentOP: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentPic: {
    borderRadius: 25,
    width: 25,
    height: 25,
    margin: 10,
  },
  commentOGPost: {
    flexDirection: "row",
    marginVertical: 5,
    maxHeight: "55%",
  },
  line: {
    backgroundColor: "#bebebe",
    width: 3,
    borderRadius: 25,
    marginHorizontal: 21,
  },
  commentScroll: {
    maxWidth: "80%",
    paddingRight: 10,
  },
  smallRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "10%",
    justifyContent: "space-evenly",
  },
  smallNumber: {
    fontSize: 11,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
