import { StyleSheet, Image, Pressable, Text, View, Button } from "react-native";
import { useFocusEffect } from "expo-router";
import { useContext, useEffect, useCallback, useState, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import PostContext from "../../components/providers/PostContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "react-native";
import CustomBottomSheet from "@/components/util/CustomBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Link, router } from "expo-router";
import Post from "@/components/postComponents/Post";
import CommentBottomSheet from "@/components/postComponents/CommentBottomSheet";
import MyContext from "@/components/providers/MyContext";

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
  const { getForYouPosts } = useContext<any>(PostContext);
  const shareModalRef = useRef<BottomSheetModal>(null);
  const commentModalRef = useRef<BottomSheetModal>(null);
  const repostModalRef = useRef<BottomSheetModal>(null);
  const deleteMenuRef = useRef<BottomSheetModal>(null); // Reference for delete menu
  const [profileImageUri, setProfileImageUri] = useState("");
  const local = useLocalSearchParams();
  const { myInfo } = useContext<any>(MyContext);

  const handleOpenShare = () => shareModalRef.current?.present();
  const handleOpenComment = () => commentModalRef.current?.present();
  const handleCloseComment = () => commentModalRef.current?.dismiss();
  const handleOpenRepost = () => repostModalRef.current?.present();
  const handleOpenDeleteMenu = () => deleteMenuRef.current?.present(); // Open delete menu

  const mortyUrl = 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg';
  const handleError = () => setProfileImageUri(mortyUrl);

  const likePost = () => setLiked((prev) => !prev);

  const addLike = async (userId: string, postId: string) => {
    try {
      const test = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/addLike`,
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
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/deleteComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
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

  const getPost = async () => {
    try {
      const result = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/getSingleComment?id=${local.comment}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const userData = await result.json();
      setThisPost(userData.comment);
    } catch (error) {
      console.log(error, "this is the get user error");
    }
  };

  useFocusEffect(
    useCallback(() => {
      getPost();
      return () => {
        setThisPost("");
      };
    }, [local.comment])
  );

  useEffect(() => {
    if (thisPost) {
      const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${thisPost?.user?.id}.jpg?${Date.now()}`;
      setProfileImageUri(newProfileImageUri);
    }
  }, [thisPost]);


  console.log(thisPost, 'this is this post')

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
              <Image style={styles.mainProfilePic} source={{ uri: profileImageUri }} onError={handleError} />
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
              <ThemedText style={styles.smallNumber}>{thisPost?.replies?.length}</ThemedText>
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
      {thisPost?.replies?.map((comment: any) => (
        <Post key={comment.id} isComment post={comment} user={myInfo?.email} />
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainPostContainer: {
    flexDirection: "row",
    width: "100%",
    paddingLeft: 5,
    borderBottomWidth: 0.3,
    paddingBottom: 2,
    alignItems: "center",
  },
  icon: {
    padding: 10,
  },
  flex: {
    flexDirection: "row",
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
    width: "80%",
  },
  postUser: {
    fontWeight: "bold",
    fontSize: 12,
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
    width: '95%',
    justifyContent: "space-between",
    alignItems: 'center',
    paddingTop: 10,
  },
  smallRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '10%',
    justifyContent: 'space-evenly'
  },
  smallNumber: {
    fontSize: 11,
  },
  shareContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    width: '100%',
    height: '40%',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 18,
  },
  deleteContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

  },
});
