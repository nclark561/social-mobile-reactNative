import { StyleSheet, Image, Pressable, Platform, Button, Dimensions } from "react-native";
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
import { ClipLoader } from "react-spinners";
import DeletePopup from "@/components/postComponents/DeletePopup";
import CommentPopup from "@/components/postComponents/CommentPopup";
import SharePopup from "@/components/postComponents/SharePopup";
import RepostPopup from "@/components/postComponents/RepostPopup";

interface Post {
  id: string;
  content: string;
  date: Date;
  replies: any;
  email: string;
  profilePic: string;
  username: string;
}

const { width } = Dimensions.get('window')

export default function CommentPage() {
  const colorScheme = useColorScheme();
  const [liked, setLiked] = useState(false);
  const [thisPost, setThisPost] = useState<any>();
  const { getForYouPosts, getBaseUrl } = useContext<any>(PostContext);
  const shareModalRef = useRef<BottomSheetModal>(null);
  const commentModalRef = useRef<BottomSheetModal>(null);
  const repostModalRef = useRef<BottomSheetModal>(null);
  const deleteMenuRef = useRef<BottomSheetModal>(null); // Reference for delete menu
  const [profileImageUri, setProfileImageUri] = useState("");
  const local = useLocalSearchParams();
  const { myInfo } = useContext<any>(MyContext);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [commentVisible, setCommentVisible] = useState(false); // State for menu visibility
  const [shareVisible, setShareVisible] = useState(false);
  const [repostVisible, setRepostVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false)
  const fadedTextColor = colorScheme === "dark" ? "#525252" : "#bebebe";

  const handleOpenShare = () => {
    if (Platform.OS === 'web' && width > 1000) {
      setShareVisible(true)
    } else {
      shareModalRef.current?.present()
    }
  };
  const handleCloseShare = () => {
    if (Platform.OS === 'web' && width > 1000) {
      setShareVisible(false)
    } else {
      shareModalRef.current?.dismiss()
    }
  };
  const handleOpenComment = () => {
    if (Platform.OS === 'web' && width > 1000) {
      setCommentVisible(true)
    } else {
      commentModalRef.current?.present();
    }
  }
  const handleCloseComment = () => {
    if (Platform.OS === 'web' && width > 1000) {
      setCommentVisible(false)
    } else {
      commentModalRef.current?.dismiss();
    }
  };
  const handleOpenRepost = () => {
    if (Platform.OS === 'web' && width > 1000) {
      setRepostVisible(true)
    } else {
      repostModalRef.current?.present();
    }
  };
  const handleCloseRepost = () => {
    if (Platform.OS === 'web' && width > 1000) {
      setRepostVisible(false)
    } else {
      repostModalRef.current?.dismiss();
    }
  };
  const handleOpenDeleteMenu = () => {
    if (Platform.OS === 'web' && width > 1000) {
      setDeleteVisible(true)
    } else {
      deleteMenuRef.current?.present();
    }
  };
  const handleCloseDeleteMenu = () => {
    if (Platform.OS === 'web' && width > 1000) {
      setDeleteVisible(false)
    } else {
      deleteMenuRef.current?.dismiss();
    }
  };

  const mortyUrl =
    "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";
  const handleError = () => setProfileImageUri(mortyUrl);

  const likePost = () => setLiked((prev) => !prev);

  const addLike = async (userId: string, postId: string) => {
    try {
      const test = await fetch(`${getBaseUrl()}/api/posts/addCommentLike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          postId,
        }),
      });
      await getForYouPosts();
    } catch (error) {
      console.log(error, "this is the add like error");
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
      handleCloseComment()
      const response = await fetch(`${getBaseUrl()}/posts/addComment`, {
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
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/posts/deleteComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (result) {
        router.navigate("/(tabs)/");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const getPost = async () => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/posts/getSingleComment?id=${local.comment}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userData = await result.json();
      setThisPost(userData.comment);
      setLoading(false);
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
    }, [local.comment]),
  );

  useEffect(() => {
    if (thisPost) {
      const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${thisPost?.user?.id}?${Date.now()}`;
      setProfileImageUri(newProfileImageUri);
    }
  }, [thisPost]);

  const isLikedByUser = (likes: string[]): boolean => {
    return likes?.includes(myInfo?.id);
  };

  console.log(thisPost, 'comment')

  return (
    <ThemedView style={{ flex: 1 }}>
      {loading && (
        <ThemedView
          style={[styles.spinnerContainer, { backgroundColor: fadedTextColor }]}
        >
          <ClipLoader color="#26a7de" />
        </ThemedView>
      )}
      <ThemedView style={styles.icon}>
        <Pressable onPress={() => {
          router.back()
        }}>

          <Ionicons
            size={20}
            name="arrow-back-outline"
            color={colorScheme === "dark" ? "white" : "black"}
          />

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
              <Image
                style={styles.mainProfilePic}
                source={{ uri: profileImageUri }}
                onError={handleError}
              />
            </ThemedView>
            <Link href={`/profile/${thisPost?.email}`}>
              <ThemedText style={styles.postUser}>
                {thisPost?.userName}
              </ThemedText>
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
              <ThemedText style={styles.smallNumber}>
                {thisPost?.replies?.length}
              </ThemedText>
            </ThemedView>
            <ThemedView>
              <Ionicons
                size={15}
                name="git-compare-outline"
                onPress={handleOpenRepost}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <ThemedText style={styles.smallNumber}>
                {thisPost?.reposts?.length}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.smallRow}>
              <Ionicons
                onPress={() => { addLike(myInfo?.id, thisPost?.id) }}
                size={15}
                name={
                  isLikedByUser(thisPost?.likes) ? "heart" : "heart-outline"
                }
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
        {width < 1000 ? (<CustomBottomSheet
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
        </CustomBottomSheet>) : <SharePopup handleCloseShare={handleCloseShare} shareVisible={shareVisible} />}
        {width < 1000 ? (<CommentBottomSheet
          post={thisPost}
          commentModalRef={commentModalRef}
          user={thisPost?.user}
        />) : <CommentPopup isComment myInfo={myInfo} addComment={addComment} setCommentInput={setCommentInput} handleCloseComment={handleCloseComment} commentVisible={commentVisible} commentInput={commentInput} post={thisPost} />}
        {width < 1000 ? (<CustomBottomSheet snapPercs={["20%"]} ref={repostModalRef}>
          <ThemedView
            style={[styles.shareContainer, { marginBottom: 30, height: "75%" }]}
          >
            <ThemedView style={[styles.shareOption, { marginTop: 10 }]}>
              <Pressable>
                <Ionicons
                  size={25}
                  name="git-compare-outline"
                  color={colorScheme === "dark" ? "white" : "black"}
                ></Ionicons>
                <ThemedText style={styles.optionText}>Repost</ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </CustomBottomSheet>) : <></>}
        {/* Delete Menu */}
        {width < 1000 ? (<CustomBottomSheet snapPercs={["15%"]} ref={deleteMenuRef}>
          <ThemedView style={styles.deleteContainer}>
            {myInfo?.id === thisPost?.userId && (
              <Button
                title="Delete Post"
                color="red"
                onPress={() => {
                  deletePost(thisPost?.id);
                  deleteMenuRef.current?.dismiss();
                }}
              />
            )}
          </ThemedView>
        </CustomBottomSheet>) : <DeletePopup handleCloseDeleteMenu={handleCloseDeleteMenu} postOwnerId={thisPost?.userId} post={thisPost} isComment deletePost={null} deleteComment={deletePost} deleteVisible={deleteVisible} myInfo={myInfo} />}
      </ThemedView>
      {thisPost?.replies?.map((comment: any) => (
        <Post
          key={comment.id}
          isComment
          post={comment}
          user={myInfo?.email}
          setLoading={setLoading}
        />
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
    fontSize: 14,
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
  deleteContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  spinnerContainer: {
    position: "absolute",
    borderRadius: 35,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 20,
  },
});
