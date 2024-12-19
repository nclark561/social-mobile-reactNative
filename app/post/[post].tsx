import {
  StyleSheet,
  Button,
  Pressable,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useContext, useCallback, useEffect, useMemo } from "react";
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
import { useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { ClipLoader } from "react-spinners";
import DeletePopup from "@/components/postComponents/DeletePopup";
import CommentPopup from "@/components/postComponents/CommentPopup";
import SharePopup from "@/components/postComponents/SharePopup";


interface Post {
  id: string;
  content: string;
  date: Date;
  comments: any;
  email: string;
  likes: any;
  profilePic: string;
}

export default function PostPage() {
  const route = useRoute();
  const colorScheme = useColorScheme();
  const { post } = route.params as { post: Post };
  const [thisPost, setThisPost] = useState<any>();
  const [liked, setLiked] = useState();
  const [postComments, setPostComments] = useState<any>();
  const [commentInput, setCommentInput] = useState("");
  const { getForYouPosts, getBaseUrl } = useContext<any>(PostContext);
  const shareModalRef = useRef<BottomSheetModal>(null);
  const commentModalRef = useRef<BottomSheetModal>(null);
  const [optimisticLike, setOptimisticLike] = useState(thisPost?.likes?.length);
  const repostModalRef = useRef<BottomSheetModal>(null);
  const deleteMenuRef = useRef<BottomSheetModal>(null); // Reference for delete menu
  const local = useLocalSearchParams<any>();
  const { myInfo, loggedIn } = useContext<any>(MyContext);
  const [loading, setLoading] = useState(true);
  const [commentVisible, setCommentVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [repostVisible, setRepostVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false)

  const [renderKey, setRenderKey] = useState(0);
  const fadedTextColor = colorScheme === "dark" ? "#525252" : "#bebebe";

  const repostedByMe = useMemo(() => {
    return thisPost?.reposts?.filter((e: any) => e.userId === myInfo?.id).length > 0;;
  }, [thisPost?.reposts, myInfo?.id]);

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
    debugger
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

  const likePost = () => {
    setLiked((prev) => !prev);
  };

  useEffect(() => {
    setOptimisticLike(thisPost?.likes?.length)
  }, [thisPost])

  const addLike = async (userId: string, postId: string, comment: boolean) => {
    setLiked((prevLiked) => !prevLiked);
    const updatedLikesCount = liked ? optimisticLike - 1 : optimisticLike + 1;
    setOptimisticLike(updatedLikesCount);
    try {
      const test = await fetch(
        comment
          ? `${getBaseUrl()}/api/posts/addCommentLike`
          : `${getBaseUrl()}/api/posts/addLike`,
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
      await getForYouPosts();
      await getPost(local.post);
    } catch (error) {
      console.log(error, "this is the add like error in [post]");
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/posts/deletePost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: postId }),
      });
      const result = await response.json();
      if (result) {
        router.navigate("/(tabs)/");
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
    handleCloseComment()
    try {
      const response = await fetch(`${getBaseUrl()}/api/posts/addComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment,
          userName,
          postId,
          userId,
          // parent_id: commentId,
        }),
      });
      const post = await response.json();
      await getPost(local.post);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getPost = async (id: string) => {
    try {
      const result = await fetch(`${getBaseUrl()}/api/posts/getPost?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userData = await result.json();
      setThisPost(userData.post);
      setPostComments(userData?.post.comments);
      setOptimisticLike(userData?.post?.likes?.length)
      setLoading(false);
    } catch (error) {
      console.log(error, "this is the get user error");
    }
  };

  const isLikedByUser = (likes: string[]): boolean => {
    const liked = likes?.includes(myInfo?.id);
    return liked;
  };

  useFocusEffect(
    useCallback(() => {
      getPost(local.post);
      return () => {
        setThisPost("");
      };
    }, [local.post]),
  );

  const blurhash =
    thisPost?.owner?.blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe";

  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL
        }/storage/v1/object/public/profile-images/${id}?${Date.now()}`;
      return newProfileImageUri;
    }
  };


  const repost = async (userId: string, postId: string) => {
    setLoading(true);
    handleCloseRepost();
    try {
      const test = await fetch(`${getBaseUrl()}reposts/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          post_id: postId,
        }),
      });
      await getPost(local.post);
      setLoading(false);
    } catch (error) {
      console.log(error, "this is the repost error in post");
      setLoading(false);
    }
  };

  const undoRepost = async (userId: string, postId: string) => {
    setLoading(true);
    handleCloseRepost();
    try {
      await fetch(
        `${getBaseUrl()}reposts/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          post_id: postId,
        }),
      });
      await getPost(local.post);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };






  return (
    <ThemedView style={styles.realRow}>
      {loading && (
        <ThemedView
          style={[styles.spinnerContainer, { backgroundColor: fadedTextColor }]}
        >
          <ClipLoader color="#26a7de" />
        </ThemedView>
      )}
      <ThemedView style={[styles.content, { flex: 1 }]}>
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
                  source={{ uri: `${profileImage(thisPost?.owner?.id)}` }}
                  placeholder={{ blurhash }}
                />
              </ThemedView>
              <Link href={`/profile/${thisPost?.email}`}>
                <ThemedText style={styles.postUser}>
                  {thisPost?.userName}
                </ThemedText>
              </Link>
            </ThemedView>
            <ThemedText style={styles.postText}>{thisPost?.content}</ThemedText>
            <ThemedView style={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
              <ThemedView style={styles.reactionsContainer}>
                <ThemedView style={styles.smallRow}>
                  <Ionicons
                    size={15}
                    name="chatbubble-outline"
                    onPress={loggedIn ? handleOpenComment : undefined}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                  <ThemedText style={styles.smallNumber}>
                    {postComments?.length}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.smallRow}>
                  <Ionicons
                    size={15}
                    name={repostedByMe ? "git-compare" : "git-compare-outline"}
                    onPress={handleOpenRepost}
                    color={
                      repostedByMe
                        ? "green"
                        : colorScheme === "dark"
                          ? "white"
                          : "black"
                    }
                  />                  
                  <ThemedText style={styles.smallNumber}>
                    {thisPost?.reposts?.length}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.smallRow}>
                  <Ionicons
                    size={15}
                    key={`like-icon-${isLikedByUser(thisPost?.likes)}`}
                    name={
                      isLikedByUser(thisPost?.likes) ? "heart" : "heart-outline"
                    }
                    onPress={() => {
                      if (loggedIn) addLike(myInfo?.id, thisPost?.id, false);
                    }}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
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
          </CustomBottomSheet>) : (
            <SharePopup shareVisible={shareVisible} handleCloseShare={handleCloseShare} />
          )}
          {width < 1000 ? (<CommentBottomSheet
            post={thisPost}
            commentModalRef={commentModalRef}
            user={thisPost?.owner}
          />) : <CommentPopup myInfo={myInfo} setCommentInput={setCommentInput} commentInput={commentInput} handleCloseComment={handleCloseComment} addComment={addComment} commentVisible={commentVisible} post={thisPost} />}
          {width < 1000 ? (<CustomBottomSheet snapPercs={["20%"]} ref={repostModalRef}>
            {!repostedByMe ? (
              <Pressable
                onPress={() => {
                  repost(myInfo?.id, local?.post);
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
            ) : (
              <Pressable
                onPress={() => {
                  undoRepost(myInfo?.id, local?.post);
                }}
                style={[styles.shareOption, { marginTop: 10 }]}
              >
                <Ionicons
                  size={25}
                  name="git-compare"
                  color="red"
                ></Ionicons>
                <ThemedText style={[styles.optionText, { color: "red" }]}>
                  Undo Repost
                </ThemedText>
              </Pressable>
            )}
          </CustomBottomSheet>) : <></>}

          {/* Delete Menu */}
          {width < 1000 ? (<CustomBottomSheet snapPercs={["15%"]} ref={deleteMenuRef}>
            <ThemedView style={styles.deleteContainer}>
              {myInfo?.id === thisPost?.owner?.id && (
                <Button
                  title="Delete Post"
                  color="red"
                  onPress={() => {
                    deletePost(thisPost?.id);
                    handleCloseDeleteMenu();
                  }}
                />
              )}
            </ThemedView>
          </CustomBottomSheet>) : <DeletePopup post={thisPost} deleteComment={null} deletePost={deletePost} deleteVisible={deleteVisible} postOwnerId={thisPost?.owner?.id} myInfo={myInfo} handleCloseDeleteMenu={handleCloseDeleteMenu} />}
        </ThemedView>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
        // style={{ height: "72%", flex: 1 }}
        >
          {thisPost?.comments?.map((comment: any) => {
            return (
              <Post
                key={comment.id}
                getPost={async (id: string) => {
                  console.log("getPost called with ID:", id);
                  getPost(id);
                }}
                isComment
                localId={thisPost?.id}
                post={comment}
                user={myInfo?.id}
                setLoading={setLoading}
              />
            );
          })}
        </Animated.ScrollView>
      </ThemedView>
    </ThemedView >
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  postContainer: {
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 0.3,
    paddingBottom: 2,
    borderColor: "gray",
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
    ...(Platform.OS === "web" && {
      width: "100%",
    }),
  },
  postUser: {
    fontWeight: "bold",
    fontSize: 12,
    paddingBottom: 5,
  },
  postText: {
    flexShrink: 1,
    paddingTop: 10,
    fontSize: 14,
  },
  ellipsis: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  reactionsContainer: {
    flexDirection: "row",
    width: "80%",
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
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  realRow: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    height: "100%",
    padding: 10,
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    width: "30%",
  },
  icon: {
    padding: 10,
  },
  deleteContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  desktopHiddenBorder: {
    display: width > 600 ? "flex" : "none",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "rgb(232,232,232)",
    borderRadius: 10,
    padding: 15,
  },
  sectionHeader: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 20,
    marginBottom: 10,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileCardText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  profileButton: {
    backgroundColor: "rgb(38,102,193)", // LinkedIn Blue
    padding: 5,
    margin: 5,
    borderRadius: 5,
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
