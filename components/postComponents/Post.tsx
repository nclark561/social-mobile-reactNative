import React, { useContext, useState, useRef } from "react";
import { StyleSheet, Image, Button, Pressable, Text, View } from "react-native";
import MyContext from "../providers/MyContext";
import PostContext from "../providers/PostContext";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "react-native";
import CustomBottomSheet from "../util/CustomBottomSheet";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import { Link, router } from "expo-router";

interface Post {
  id: string;
  content: string;
  date: Date;
  comments: any;
  email: string;
  likes: any;
  profilePic: string;
  username: string;
  replies?: any;
  postId?: string;
  userName: string;
  userId?: string;
  owner: any;
}

interface PostProps {
  isComment?: boolean;
  post: Post;
  user: string;
}

export default function Post({ post, isComment, user }: PostProps) {
  const colorScheme = useColorScheme();
  const [liked, setLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [profileImageUri, setProfileImageUri] = useState("");
  const [menuVisible, setMenuVisible] = useState(false); // State for menu visibility
  const mortyUrl =
    "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";
  const link = isComment ? "comment" : "post";

  const { getForYouPosts, getUserPosts } = useContext<any>(PostContext);
  const { setLoginToggle, myInfo, loggedIn, getUser } =
    useContext<any>(MyContext);

  const shareModalRef = useRef<BottomSheetModal>(null);
  const commentModalRef = useRef<BottomSheetModal>(null);
  const repostModalRef = useRef<BottomSheetModal>(null);
  const deleteMenuRef = useRef<BottomSheetModal>(null); // Ref for the delete menu

  const handleOpenShare = () => shareModalRef.current?.present();
  const handleOpenComment = () => commentModalRef.current?.present();
  const handleCloseComment = () => commentModalRef.current?.dismiss();
  const handleOpenRepost = () => repostModalRef.current?.present();
  const handleOpenDeleteMenu = () => deleteMenuRef.current?.present(); // Open delete menu

  const likePost = () => {
    setLiked((prev) => !prev);
  };

  const isLikedByUser = (likes: string[]): boolean => {
    return likes.includes(myInfo?.id);
  };

  const addLike = async (userId: string, postId: string) => {
    try {
      const test = await fetch(
        !isComment
          ? `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/addLike`
          : `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/addCommentLike`,
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
      await getUserPosts(user);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/deletePost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId,
          }),
        }
      );
      await getForYouPosts();
      await getUserPosts(user);
      deleteMenuRef.current?.dismiss(); // Close delete menu after deletion
    } catch (error) {
      console.log(error, "this is the delete post error");
    }
  };

  const deleteComment = async (id: string) => {
    try {
      await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/deleteComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        }
      );
      await getForYouPosts();
      await getUserPosts(user);
      deleteMenuRef.current?.dismiss(); // Close delete menu after deletion
    } catch (error) {
      console.log(error, "this is the delete post error");
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
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/addComment`,
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
      handleCloseComment();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL
        }/storage/v1/object/public/profile-images/${id}.jpg?${Date.now()}`;
      return newProfileImageUri;
    }
  };

  console.log(post, 'this is postInfo')


  return (
    <Pressable onPress={() => router.navigate(`/${link}/${post?.id}`)}>
      <ThemedView
        style={[
          styles.postContainer,
          colorScheme === "dark"
            ? { borderColor: "#525252" }
            : { borderColor: "#bebebe" },
        ]}
      >
        <ThemedView style={styles.flex}>
          <Image
            style={styles.profilePic}
            source={{
              uri: `${profileImage(post?.owner?.id || post?.userId)}`,
            }}
          />
        </ThemedView>
        <ThemedView style={styles.postContent}>
          <Link href={`/profile/${post.email}`} style={styles.link}>
            <ThemedText style={styles.postUser}>{post?.userName}</ThemedText>
          </Link>
          <ThemedText style={styles.postText}>{post?.content}</ThemedText>
          <ThemedView style={styles.reactionsContainer}>
            <ThemedView style={styles.smallRow}>
              <Ionicons
                size={15}
                name="chatbubble-outline"
                onPress={handleOpenComment}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <ThemedText style={styles.smallNumber}>
                {post?.comments?.length}
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
                name={isLikedByUser(post.likes) ? "heart" : "heart-outline"}
                onPress={() => {
                  addLike(myInfo?.id, post.id);
                }}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <ThemedText style={styles.smallNumber}>
                {post?.likes.length}
              </ThemedText>
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
          onPress={handleOpenDeleteMenu} // Open the delete menu on click
        />
        <CustomBottomSheet
          snapPercs={["30%"]}
          ref={deleteMenuRef} // Reference for the delete menu
        >
          <ThemedView style={styles.deleteMenu}>
            <Button
            
              title="Delete Post"
              color="red"
              onPress={() => {if(isComment) {deleteComment(post.id)} else {deletePost(post.id)}}} // Delete the post on button press
            />
          </ThemedView>
        </CustomBottomSheet>
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
        <CustomBottomSheet
          snapPercs={["70%"]}
          ref={commentModalRef}
          hideCancelButton
        >
          <ThemedView style={styles.commentContainer}>
            <ThemedView style={styles.buttonContainer}>
              <Button title="Cancel" onPress={handleCloseComment}></Button>
              <Pressable
                onPress={() => {
                  if (isComment) {
                    if (!post.postId) return;
                    addComment(
                      commentInput,
                      myInfo.username,
                      post.postId,
                      myInfo.id,
                      post.id
                    );
                  } else {
                    addComment(
                      commentInput,
                      myInfo.username,
                      post.id,
                      myInfo.id
                    );
                  }
                }}
                style={styles.postButton}
              >
                <Text style={styles.buttonText}>Post</Text>
              </Pressable>
            </ThemedView>
            <ThemedView style={styles.commentOP}>
              <Image
                style={styles.commentPic}
                source={{
                  uri: `${profileImage(post?.owner?.id || post?.userId)}`,
                }}
              />
              <ThemedText style={styles.postUser}>
                {post.email || post.userName}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.commentOGPost}>
              <View style={styles.line}></View>
              <ScrollView style={styles.commentScroll}>
                <ThemedText>{post.content}</ThemedText>
              </ScrollView>
            </ThemedView>
            <ThemedView style={{ flexDirection: "row" }}>
              <Image
                style={styles.commentPic}
                source={{
                  uri: `${profileImage(myInfo?.id)}`,
                }}
              />
              <BottomSheetTextInput
                autoFocus
                onChangeText={(input) => setCommentInput(input)}
                multiline
                placeholder="Post your reply"
                style={[
                  { paddingTop: 15, maxWidth: "80%" },
                  colorScheme === "dark"
                    ? { color: "#bebebe" }
                    : { color: "#525252" },
                ]}
              />
            </ThemedView>
          </ThemedView>
        </CustomBottomSheet>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 0.3,
    paddingBottom: 2,
  },
  flex: {
    flexDirection: "row",
    height: "35%",
  },
  profilePic: {
    borderRadius: 25,
    width: 25,
    height: 25,
    marginTop: 20,
    marginLeft: 10,
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
  postText: {
    flexShrink: 1,
    fontSize: 13,
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
  smallWidth: {
    width: 40,
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
  postButton: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#26a7de",
  },
  buttonText: {
    color: "white",
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
  link: {
    alignSelf: "flex-start",
    flexShrink: 1,
  },
  deleteMenu: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
