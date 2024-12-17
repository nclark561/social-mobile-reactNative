import React, { useContext, useState, useRef, SetStateAction, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Modal,
  Pressable,
  Text,
  View,
  Dimensions,
} from "react-native";
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
import CommentPopup from "./CommentPopup";
import SharePopup from "./SharePopup";
import RepostPopup from "./RepostPopup";
import DeletePopup from "./DeletePopup";
import { useIsFocused } from "@react-navigation/native";

interface Post {
  id: string;
  content: string;
  date: Date;
  comments: any;
  email: string;
  likes: any;
  profilePic: string;
  user_name: string;
  replies?: any;
  post_id?: string;
  userName: string;
  userId?: string;
  owner: any;
  reposts: any;
  user: { blurhash: string };

}

interface PostProps {
  repostLength?: number;
  isComment?: boolean;
  post: Post;
  user?: string;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  getPost?: (id: string) => Promise<void>;
  localId: string
}

const { width } = Dimensions.get("window");

export default function Post({
  post,
  getPost,
  localId,
  isComment,
  user,
  repostLength,
  setLoading,
}: PostProps) {
  const colorScheme = useColorScheme();
  const [commentInput, setCommentInput] = useState("");
  const [optimisticLike, setOptimisticLike] = useState(post?.likes?.length);
  const [optimisticomment, setOptimisticComment] = useState(post?.comments ? post?.comments?.length : post?.replies?.length);
  const [commentVisible, setCommentVisible] = useState(false); // State for menu visibility
  const [shareVisible, setShareVisible] = useState(false);
  const [repostVisible, setRepostVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const link = isComment ? "comment" : "post";
  const postOwner = isComment ? post?.user : post?.owner;
  const { getForYouPosts, getUserPosts, getBaseUrl, getAllForYouPosts } = useContext<any>(PostContext);
  const { myInfo, loggedIn } = useContext<any>(MyContext);
  const shareModalRef = useRef<BottomSheetModal>(null);
  const commentModalRef = useRef<BottomSheetModal>(null);
  const [profileImageUri, setProfileImageUri] = useState(``);
  const repostModalRef = useRef<BottomSheetModal>(null);
  const deleteMenuRef = useRef<BottomSheetModal>(null); // Ref for the delete menu



  const repostedByMe = useMemo(() => {
    if (post.repostedcomments) {
      return post?.repostedcomments?.some((e: any) => e.userId === myInfo?.id) || false;
    } else {
      return post?.reposts?.some((e: any) => e.userId === myInfo?.id) || false;
    }

  }, [post?.reposts, myInfo?.id]);

  const handleOpenShare = () => {
    if (Platform.OS === "web" && width > 1000) {
      setShareVisible(true);
    } else {
      shareModalRef.current?.present();
    }
  };
  const handleCloseShare = () => {
    if (Platform.OS === "web" && width > 1000) {
      setShareVisible(false);
    } else {
      shareModalRef.current?.dismiss();
    }
  };
  const handleOpenComment = () => {
    if (Platform.OS === "web" && width > 1000) {
      setCommentVisible(true);
    } else {
      commentModalRef.current?.present();
    }
  };
  const handleCloseComment = () => {
    if (Platform.OS === "web" && width > 1000) {
      setCommentVisible(false);
    } else {
      commentModalRef.current?.dismiss();
    }
  };
  const handleOpenRepost = () => {
    if (Platform.OS === "web" && width > 1000) {
      setRepostVisible(true);
    } else {
      repostModalRef.current?.present();
    }
  };
  const handleCloseRepost = () => {
    if (Platform.OS === "web" && width > 1000) {
      setRepostVisible(false);
    } else {
      repostModalRef.current?.dismiss();
    }
  };
  const handleOpenDeleteMenu = () => {
    if (Platform.OS === "web" && width > 1000) {
      setDeleteVisible(true);
    } else {
      deleteMenuRef.current?.present();
    }
  };
  const handleCloseDeleteMenu = () => {
    if (Platform.OS === "web" && width > 1000) {
      setDeleteVisible(false);
    } else {
      deleteMenuRef.current?.dismiss();
    }
  };

  const likePost = () => {
    setLiked((prev) => !prev);
  };


  const isLikedByUser = (likes: string[]): boolean => {
    if (!myInfo?.id) return false;
    return likes?.includes(myInfo.id);
  };

  const [liked, setLiked] = useState(isLikedByUser(post.likes));

  useEffect(() => {
    setLiked(isLikedByUser(post?.likes));
  }, [post?.likes, myInfo?.id]);

  const addLike = async (userId: string, postId: string) => {

    setLiked((prevLiked) => !prevLiked);
    const updatedLikesCount = liked ? optimisticLike - 1 : optimisticLike + 1;
    setOptimisticLike(updatedLikesCount);
    try {
      const test = await fetch(
        !isComment
          ? `${getBaseUrl()}/api/posts/addLike`
          : `${getBaseUrl()}/api/posts/addCommentLike`,
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
      await getAllForYouPosts();
      await getForYouPosts(myInfo?.id);
      await getUserPosts(user);
    } catch (error) {
      console.log(error, "this is the add like error in post");
    }
  };



  const deletePost = async (postId: string) => {
    setLoading(true);
    try {
      await fetch(`${getBaseUrl()}/api/posts/deletePost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
        }),
      });
      deleteMenuRef.current?.dismiss();
      await getForYouPosts(myInfo?.id);
      await getUserPosts(myInfo.email, myInfo.id);
      setLoading(false);
    } catch (error) {
      console.log(error, "this is the delete post error");
      setLoading(false);
    }
  };

  const deleteComment = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`${getBaseUrl()}/api/posts/deleteComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      deleteMenuRef.current?.dismiss();
      handleCloseComment();
      await getForYouPosts(myInfo?.id);      
      await getUserPosts(myInfo.email, myInfo.id);
      if (getPost) {
        await getPost(localId);
      } else {
        console.log("getPost is not defined");
      }
      setLoading(false)
      
    } catch (error) {
      console.log(error, "this is the delete post error");
      setLoading(false);
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
      const response = await fetch(`${getBaseUrl()}/api/posts/addComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment,
          userName,
          postId: localId ? localId : postId,
          userId,
          ...(isComment && { commentId }),
        }),
      });
      const postId1 = await response.json();
      const updatedCommentCount = optimisticomment + 1;
      setOptimisticComment(updatedCommentCount);
      handleCloseComment();
      await getForYouPosts(myInfo?.id);
      // await getAllForYouPosts();
      await getUserPosts(myInfo.email, myInfo.id);
      if (getPost) {
        await getPost(localId);
      } else {
        console.log("getPost is not defined");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };


  useEffect(() => {
    if (myInfo?.id) {
      const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${post?.owner?.id || post?.userId || user}?${Date.now()}`;
      setProfileImageUri(newProfileImageUri);
    }
  }, [post]);


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
      const test = await fetch(`${getBaseUrl()}/api/posts/addReposts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...(isComment ? { commentId: postId } : { postId }),
        }),
      });
      await getUserPosts(myInfo?.email, myInfo?.id);
      await getForYouPosts(myInfo?.id);
      if (getPost) {
        await getPost(localId);
      } else {
        console.log("getPost is not defined");
      }
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
        `${getBaseUrl()}/api/posts/deleteRepost?user=${userId}&post=${postId}`,
        {
          method: "DELETE",
        }
      );
      await getForYouPosts(myInfo?.id);
      if (getPost) {
        await getPost(localId);
      } else {
        console.log("getPost is not defined");
      }
      await getAllForYouPosts();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const blurhash = isComment ? post?.user?.blurhash : post?.owner?.blurhash;
  const blurhash2 = myInfo?.blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe";

  const handleProfilePress = (event: any) => {
    // Prevent parent Pressable from being triggered
    event.stopPropagation();
  };

  const handlePostPress = () => {
    if (commentVisible || shareVisible || repostVisible || deleteVisible)
      return;
    router.push(`/${link}/${post.id}`);
  };

  useEffect(() => {
    setOptimisticComment(post.comments ? post?.comments?.length : post?.replies?.length)
  }, [post])

console.log(post,'this is the post')

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
          <ProfileImage
            profileUri={profileImageUri}
            blurhash={blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe"}
          />
        </ThemedView>
        <ThemedView style={styles.postContent}>
          <Link
            href={`/profile/${post.email}`}
            style={styles.link}
            onPress={handleProfilePress}
          >
            <ThemedText style={styles.postUser}>{postOwner?.username ? postOwner?.username : post?.userName}</ThemedText>
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
                {optimisticomment}
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
                {post?.reposts ? post?.reposts.length : post?.repostedcomments?.length}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.smallRow}>
              {loggedIn ? <Pressable
                onPress={() => {
                  likePost();
                }}
              >
                <Ionicons
                  size={15}
                  name={liked ? "heart" : "heart-outline"}
                  onPress={(event) => {
                    event?.stopPropagation();
                    addLike(myInfo?.id, post.id);
                  }}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </Pressable> :
                <Ionicons
                  size={15}
                  name={liked ? "heart" : "heart-outline"}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              }

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
            debugger
            if (myInfo?.id === postOwner?.id) {
              debugger
              handleOpenDeleteMenu();
            }
          }}
        />
        {width < 1000 ? (
          <CustomBottomSheet snapPercs={["20%"]} ref={deleteMenuRef}>
            {myInfo?.id === postOwner?.id && (
              <Pressable
                style={styles.deleteButton}
                onPress={() => {
                  if (isComment) {
                    deleteComment(post.id);
                  } else {
                    deletePost(post.id);
                  }
                  handleCloseDeleteMenu()
                }}
              >
                <Text style={styles.deleteButtonText}>Delete Post</Text>
              </Pressable>
            )}
            <Pressable onPress={handleCloseDeleteMenu}>
              <Text style={styles.deleteButtonText}>Cancel</Text>
            </Pressable>
          </CustomBottomSheet>
        ) : (
          <DeletePopup
            handleCloseDeleteMenu={handleCloseDeleteMenu}
            post={post}
            isComment={isComment}
            deletePost={deletePost}
            deleteComment={deleteComment}
            postOwnerId={postOwner?.id}
            myInfo={myInfo}
            deleteVisible={deleteVisible}
          />
        )}
        {width < 1000 ? (
          <CustomBottomSheet
            snapPercs={["25%"]}
            ref={shareModalRef}
            title="Share"
          >
            <ThemedView style={styles.shareContainer}>
              <ThemedView style={styles.shareOption}>
                <Ionicons
                  size={25}
                  name="copy-outline"
                  color={colorScheme === "dark" ? "white" : "black"}
                ></Ionicons>
                <ThemedText style={styles.optionText}>Copy Link</ThemedText>
              </ThemedView>
              {/* <Pressable
                onPress={() => {
                  handleCloseShare();
                }}
              >
                <ThemedText style={styles.cancelButton}>Cancel</ThemedText>
              </Pressable> */}
            </ThemedView>
          </CustomBottomSheet>
        ) : (
          <SharePopup
            shareVisible={shareVisible}
            handleCloseShare={handleCloseShare}
          />
        )}
        {width < 1000 ? (
          <CustomBottomSheet
            snapPercs={["5%"]}
            ref={commentModalRef}
            hideCancelButton
          >
            <ThemedView style={styles.commentContainer}>
              <ThemedView style={styles.buttonContainer}>
                <Pressable
                  onPress={handleCloseComment}
                  style={styles.cancelButton}
                >
                  <Text>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => {

                    addComment(
                      commentInput,
                      myInfo.username,
                      post.id || '',
                      myInfo.id,
                      post.id
                    );
                  }}
                  style={styles.postButton}
                >
                  <Text style={styles.buttonText}>Post from homepage</Text>
                </Pressable>
              </ThemedView>
              <ThemedView style={styles.commentOP}>
                <Image
                  style={styles.commentPic}
                  source={{
                    uri: `${profileImage(post?.owner?.id || post?.userId)}`,
                  }}
                  placeholder={{
                    blurhash:
                      blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe",
                  }}
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
                    { paddingTop: 15, maxWidth: "80%", width: "100%", borderWidth: 0 },
                    colorScheme === "dark"
                      ? { color: "#bebebe" }
                      : { color: "#525252" },
                  ]}
                />
              </ThemedView>
            </ThemedView>
          </CustomBottomSheet>
        ) : (
          <CommentPopup
            setCommentInput={setCommentInput}
            commentInput={commentInput}
            myInfo={myInfo}
            addComment={addComment}
            post={post}
            isComment={isComment}
            commentVisible={commentVisible}
            handleCloseComment={handleCloseComment}
          />
        )}
        {width < 1000 ? (
          <CustomBottomSheet snapPercs={["25%"]} ref={repostModalRef}>
            <ThemedView
              style={[
                styles.shareContainer,
                { marginBottom: 30, height: "75%" },
              ]}
            >
              <ThemedView>
                {!repostedByMe ? (
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
                ) : (
                  <Pressable
                    onPress={() => {
                      undoRepost(myInfo?.id, post.id);
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
              </ThemedView>
              {/* <ThemedView
                style={[
                  styles.shareOption,
                  { marginTop: 10, backgroundColor: "transparent" },
                ]}
              >
                <Ionicons
                  size={25}
                  name="pencil-outline"
                  color={colorScheme === "dark" ? "white" : "black"}
                ></Ionicons>
                <ThemedText style={styles.optionText}>Quote</ThemedText>
              </ThemedView> */}
            </ThemedView>
          </CustomBottomSheet>
        ) : (
          <RepostPopup
            handleCloseRepost={handleCloseRepost}
            undoRepost={undoRepost}
            repost={repost}
            post={post}
            myInfo={myInfo}
            repostVisible={repostVisible}
            repostedByMe={repostedByMe}
          />
        )}
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
    ...(Platform.OS === "web" && {
      width: "90%",
    }),
  },
  postUser: {
    fontWeight: "bold",
    fontSize: 15,
    paddingBottom: 5,
    ...(Platform.OS === "web" && {
      fontSize: 13,
    }),
  },
  postText: {
    flexShrink: 1,
    fontSize: 13,
    paddingTop: 10
  },
  ellipsis: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  reactionsContainer: {
    flexDirection: "row",
    width: "95%",
    zIndex: 100,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: 10,
    padding: 5
  },
  smallWidth: {
    width: 40,
  },
  shareContainer: {
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cancelButton: {
    borderRadius: 15,
    padding: 5,
  },
  shareOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
    width: "100%",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 18,
    padding: 10,
  },
  commentContainer: {
    flexDirection: "column",
    paddingTop: 20,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingTop: 50,
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
    margin: 15,
  },
  commentOGPost: {
    flexDirection: "row",
    marginVertical: 5,
    paddingBottom: 20
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
    zIndex: 1000,
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
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  popup: {
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    padding: 20,
    borderRadius: 25,
  },
});
