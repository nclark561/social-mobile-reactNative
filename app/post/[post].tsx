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
import { Link, router } from "expo-router";
import MyContext from "@/components/providers/MyContext";
import CommentBottomSheet from "@/components/postComponents/CommentBottomSheet";
import Post from "@/components/postComponents/Post";


interface Post {
  id: string;
  content: string;
  date: Date;
  comments: any,
  email: string,
  likes: any,
  profilePic: string
}

export default function PostPage({ post }: { post: Post }) {
  const colorScheme = useColorScheme();
  const [liked, setLiked] = useState(false);
  const [thisPost, setThisPost] = useState<any>();
  const [commentInput, setCommentInput] = useState("");
  const { getForYouPosts } = useContext<any>(PostContext);
  const shareModalRef = useRef<BottomSheetModal>(null);
  const commentModalRef = useRef<BottomSheetModal>(null);
  const repostModalRef = useRef<BottomSheetModal>(null);
  const deleteMenuRef = useRef<BottomSheetModal>(null); // Reference for delete menu
  const local = useLocalSearchParams<any>()
  const { setLoginToggle, myInfo, loggedIn, getUser } = useContext<any>(MyContext);

  const handleOpenShare = () => shareModalRef.current?.present();
  const handleOpenComment = () => commentModalRef.current?.present();
  const handleCloseComment = () => commentModalRef.current?.dismiss();
  const handleOpenRepost = () => repostModalRef.current?.present();
  const handleOpenDeleteMenu = () => deleteMenuRef.current?.present(); // Open delete menu

  const likePost = () => {
    setLiked((prev) => !prev);
  };

  const addLike = async (
    userId: string,
    postId: string,
    comment: boolean
  ) => {

    try {
      const test = await fetch(comment ? `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/addCommentLike` : `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/addLike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          postId
        }),
      });
      await getForYouPosts()
      await getPost(local.post)
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const deletePost = async (postId: string) => {
    
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/deletePost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
        }
      );
      const result = await response.json();      
      if (result) {                
        router.navigate('/(tabs)/');
      }
    } catch (error) {
      console.error("Error deleting post:", error);
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
        },
      );
      const post = await response.json();

    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getPost = async (id: string) => {
    console.log(id, 'calling this post')
    try {
      const result = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/getPost?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userData = await result.json();
      setThisPost(userData.post);
    } catch (error) {
      console.log(error, "this is the get user error");
    }
  };

  const isLikedByUser = (likes: string[]): boolean => {
    return likes?.includes(myInfo?.id);
  };

  useFocusEffect(
    useCallback(() => {
      getPost(local.post);
      return () => {
        setThisPost('');
      };
    }, [local.post])
  );

  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${
        process.env.EXPO_PUBLIC_SUPABASE_URL
      }/storage/v1/object/public/profile-images/${id}.jpg?${Date.now()}`;
      return newProfileImageUri;
    }
  };

  
console.log(thisPost)

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView style={styles.icon}>
        <Pressable>
          <Link href="/(tabs)/">
            <Ionicons size={20} name="arrow-back-outline" color={colorScheme === 'dark' ? 'white' : 'black'} />
          </Link>
        </Pressable>
      </ThemedView>      
      <ThemedView
        style={[
          styles.mainPostContainer,
          colorScheme === "dark"
            ? { borderColor: "#525252" }
            : { borderColor: "#bebebe" },
        ]}
      >
        <ThemedView style={styles.postContent}>
          <ThemedView style={styles.row}>
            <ThemedView style={styles.flex}>
              <Image style={styles.mainProfilePic} source={{ uri: `${profileImage(thisPost?.owner?.id)}` }} />
            </ThemedView>
            <Link href={`/profile/${thisPost?.email}`}>
              <ThemedText style={styles.postUser}>{thisPost?.userName}</ThemedText>
            </Link>
          </ThemedView>
          <ThemedText style={styles.postText}>{thisPost?.content}</ThemedText>
          <ThemedView style={styles.reactionsContainer}>
            <ThemedView style={styles.smallRow}>
              <Ionicons
                size={15}
                name="chatbubble-outline"
                onPress={handleOpenComment}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <ThemedText style={styles.smallNumber}>{thisPost?.comments?.length}</ThemedText>
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
                name={isLikedByUser(thisPost?.likes) ? "heart" : "heart-outline"}
                onPress={() => { addLike(myInfo?.id, thisPost?.id, false) }}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <ThemedText style={styles.smallNumber}>{thisPost?.likes?.length}</ThemedText>
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
          onPress={handleOpenDeleteMenu} // Open delete menu on click
          color={colorScheme === "dark" ? "white" : "black"}
        />
        <CustomBottomSheet snapPercs={["25%"]} ref={shareModalRef} title="Share">
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
        <CommentBottomSheet post={thisPost} commentModalRef={commentModalRef} />
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
        
        {/* Delete Menu */}
        <CustomBottomSheet snapPercs={["15%"]} ref={deleteMenuRef}>
          <ThemedView style={styles.deleteContainer}>
            <Button
              title="Delete Post"
              color="red"
              onPress={() => {
                deletePost(thisPost?.id);
                deleteMenuRef.current?.dismiss();
              }}
            />
          </ThemedView>
        </CustomBottomSheet>
      </ThemedView>
      {thisPost?.comments?.map((comment: any) => {
        return <Post key={comment.id} isComment post={comment} user={myInfo?.email} />
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 0.3,
    paddingBottom: 2,
    borderColor: 'gray'
  },
  mainPostContainer: {
    flexDirection: "row",
    width: "100%",
    paddingLeft: 5,
    borderBottomWidth: 0.3,
    paddingBottom: 2,
  },
  flex: {
    flexDirection: "row",
    // alignItems: "center",
  },
  profilePic: {
    borderRadius: 25,
    width: 25,
    height: 25,
    marginTop: 20,
    marginLeft: 10,
  },
  mainProfilePic: {
    borderRadius: 25,
    width: 25,
    height: 25,
    marginRight: 5,
  },
  postContent: {
    flexDirection: "column",
    paddingVertical: 10,
    flexShrink: 1,
    margin: 5,
  },
  postUser: {
    fontWeight: "bold",
    fontSize: 12,
    paddingBottom: 2,
  },
  postText: {
    flexShrink: 1,
    fontSize: 13
  },
  ellipsis: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  reactionsContainer: {
    flexDirection: "row",
    width: '95%',
    justifyContent: "space-between",
    alignItems: 'center',
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '10%',
    justifyContent: 'space-evenly'
  },
  smallNumber: {
    fontSize: 11
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

  },
  icon: {
    padding: 10
  },
  deleteContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});


