import React, { useContext, useState, useRef, SetStateAction } from "react";
import { StyleSheet, Button, Pressable, Text, View } from "react-native";
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
import { Platform } from "react-native";
import ProfileImage from "../ProfileImage";
import { Image } from "expo-image";

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
  reposts: any;
  user: { blurhash: string },
}

interface PostProps {
  repostLength?: number;
  isComment?: boolean;
  post: Post;
  user?: string;
  setLoading: React.Dispatch<SetStateAction<boolean>>
}

export default function Post({
  post,
  isComment,
  user,
  repostLength,
  setLoading
}: PostProps) {
  const colorScheme = useColorScheme();
  const [commentInput, setCommentInput] = useState("");
  const [profileImageUri, setProfileImageUri] = useState("");
  const [optimisticLike, setOptimisticLike] = useState(post?.likes?.length);
  const [menuVisible, setMenuVisible] = useState(false); // State for menu visibility
  const mortyUrl =
    "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";
  const link = isComment ? "comment" : "post";
  const postOwnerId = isComment ? post?.userId : post?.owner?.id

  const { getForYouPosts, getUserPosts, getBaseUrl, getAllForYouPosts } =
    useContext<any>(PostContext);
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
  const handleOpenDeleteMenu = () => deleteMenuRef.current?.present(); 
  const handleCloseDeleteMenu = () => deleteMenuRef.current?.dismiss(); 

  const likePost = () => {
    setLiked((prev) => !prev);
  };

  const isLikedByUser = (likes: string[]): boolean => {
    if (!myInfo?.id) return false; // If user info is not available, return false
    return likes?.includes(myInfo.id); // Check if the user's ID is in the likes array
  };

  const [liked, setLiked] = useState(isLikedByUser(post.likes));


  const addLike = async (userId: string, postId: string) => {
    setLiked((prevLiked) => !prevLiked);
    const updatedLikesCount = liked ? optimisticLike - 1 : optimisticLike + 1;
    setOptimisticLike(updatedLikesCount);

    try {
      const test = await fetch(
        !isComment
          ? `${getBaseUrl()}/api/addLike`
          : `${getBaseUrl()}/api/addCommentLike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            postId,
          }),
        },
      );
      await getAllForYouPosts()
      await getForYouPosts(myInfo?.id);
      await getUserPosts(user);
    } catch (error) {
      console.log(error, "this is the add like error in post");
    }
  };

  const deletePost = async (postId: string) => {
    setLoading(true)
    try {
      await fetch(`${getBaseUrl()}/api/deletePost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
        }),
      });
      deleteMenuRef.current?.dismiss(); // Close delete menu after deletion
      await getAllForYouPosts()
      await getForYouPosts(myInfo?.id);
      await getUserPosts(user);
      setLoading(false)
    } catch (error) {
      console.log(error, "this is the delete post error");
      setLoading(false)
    }
  };

  const deleteComment = async (id: string) => {
    setLoading(true)
    try {
      await fetch(`${getBaseUrl()}/api/deleteComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      deleteMenuRef.current?.dismiss(); // Close delete menu after deletion
      await getForYouPosts(myInfo?.id);
      await getAllForYouPosts()
      await getUserPosts(user);
      setLoading(false)
    } catch (error) {
      console.log(error, "this is the delete post error");
      setLoading(false)
    }
  };

  const addComment = async (
    comment: string,
    userName: string,
    postId: string,
    userId: string,
    commentId?: string,
  ) => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/addComment`, {
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
      });
      const post = await response.json();
      handleCloseComment();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL
        }/storage/v1/object/public/profile-images/${id}?${Date.now()}`;
      return newProfileImageUri;
    }
  };

  const repost = async (userId: string, postId: string) => {
    try {
      const test = await fetch(`${getBaseUrl()}/api/addReposts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          postId,
        }),
      });
      await getForYouPosts(myInfo?.id);
      await getUserPosts(user);
    } catch (error) {
      console.log(error, "this is the repost error in post");
    }
  };
  const blurhash = isComment ? post?.user?.blurhash : post?.owner?.blurhash
  const blurhash2 = myInfo?.blurhash || 'U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe'

  const handleProfilePress = (event: any) => {
    // Prevent parent Pressable from being triggered
    event.stopPropagation();
  };

  const handlePostPress = () => {
    router.push(`/${link}/${post.id}`);
  };


  return (
    <Pressable onPress={handlePostPress}>
      <ThemedView
        style={[
          styles.postContainer,
          colorScheme === "dark"
            ? { borderColor: "#525252" }
            : { borderColor: "#bebebe" },
        ]}
      >
        <ThemedView style={styles.flex}>
          <ProfileImage profileUri={profileImage(post?.owner?.id || post?.userId || user)} blurhash={blurhash || 'U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe'} />
        </ThemedView>
        <ThemedView style={styles.postContent}>
          <Link
            href={`/profile/${post.email}`}
            style={styles.link}
            onPress={handleProfilePress}
          >
            <ThemedText style={styles.postUser}>{post.userName}</ThemedText>
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
            <ThemedView style={styles.smallRow}>
              <Ionicons
                size={15}
                name="git-compare-outline"
                onPress={handleOpenRepost}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <ThemedText style={styles.smallNumber}>
                {repostLength ? repostLength : post?.reposts?.length}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.smallRow}>
              <Pressable onPress={() => { likePost() }}>
                <Ionicons
                  size={15}
                  name={liked ? "heart" : "heart-outline"}
                  onPress={() => {
                    addLike(myInfo?.id, post.id);
                  }}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </Pressable>
              <ThemedText style={styles.smallNumber}>
                {optimisticLike}
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
          onPress={() => {
            if (myInfo?.id === postOwnerId) {              
              handleOpenDeleteMenu();
            }
          }}
        />
        <CustomBottomSheet
          snapPercs={["20%"]}
          ref={deleteMenuRef}
        >
          {myInfo?.id === postOwnerId && (<Pressable
            style={styles.deleteButton}
            onPress={() => {
              if (isComment) {
                deleteComment(post.id);
              } else {
                deletePost(post.id);
              }
            }}
          >
            <Text style={styles.deleteButtonText}>Delete Post</Text>
          </Pressable>)}
          <Pressable onPress={handleCloseDeleteMenu}>
            <Text style={styles.deleteButtonText}>Cancel</Text>
          </Pressable>
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
          snapPercs={["20%, 40%"]}
          ref={commentModalRef}
          hideCancelButton
        >
          <ThemedView style={styles.commentContainer}>
            <ThemedView style={styles.buttonContainer}>
              <Pressable onPress={handleCloseComment} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (isComment) {
                    if (!post.postId) return;
                    addComment(
                      commentInput,
                      myInfo.username,
                      post.postId,
                      myInfo.id,
                      post.id,
                    );
                  } else {
                    addComment(
                      commentInput,
                      myInfo.username,
                      post.id,
                      myInfo.id,
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
                placeholder={{ blurhash: blurhash || 'U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe' }}
                transition={500}
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
                placeholder={{ blurhash: blurhash2 }}
                transition={500}
              />
              <BottomSheetTextInput
                autoFocus
                onChangeText={(input) => setCommentInput(input)}
                multiline
                placeholder="Post your reply"
                style={[
                  { paddingTop: 15, maxWidth: "80%", width: '100%' },
                  colorScheme === "dark"
                    ? { color: "#bebebe" }
                    : { color: "#525252" },
                ]}
              />
            </ThemedView>
          </ThemedView>
        </CustomBottomSheet>
        <CustomBottomSheet snapPercs={["25%"]} ref={repostModalRef}>
          <ThemedView
            style={[styles.shareContainer, { marginBottom: 30, height: "75%" }]}
          >
            <ThemedView >
              <Pressable
                onPress={() => {
                  repost(myInfo?.id, post.id);
                }}
                style={[styles.shareOption, { marginTop: 10 }]}
              >
                <Ionicons
                  size={25}
                  name="git-compare-outline"
                  color={colorScheme === "dark" ? "white" : "black"}
                ></Ionicons>
                <ThemedText style={styles.optionText}>Repost</ThemedText>
              </Pressable>
            </ThemedView>
            <ThemedView style={[styles.shareOption, { marginTop: 10, backgroundColor: 'transparent' }]}>
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
    ...(Platform.OS === 'web' && {
      width: '90%'
    })
  },
  postUser: {
    fontWeight: "bold",

    fontSize: 15,
    paddingBottom: 2,
    ...(Platform.OS === 'web' && {
      fontSize: 13
    })
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
    height: "50%",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 18,
    padding: 10
  },
  commentContainer: {
    flexDirection: "column",
    paddingTop: 20,
    width: '100%'
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
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
    padding: 3,
  },
  deleteMenu: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

});