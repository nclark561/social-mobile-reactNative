import {
  StyleSheet,
  Pressable,
  Button,
  useColorScheme,
  Text,
  Dimensions,
  TextInput,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useContext, useCallback, useEffect, useMemo } from "react";
import Animated from "react-native-reanimated";
import Post from "@/components/postComponents/Post";
import { Alert } from "react-native";
import Header from "@/components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomBottomSheet from "@/components/util/CustomBottomSheet";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostContext from "@/components/providers/PostContext";
import MyContext from "@/components/providers/MyContext";
import { useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ClipLoader } from "react-spinners";

export default function HomeScreen() {
  const newPostRef = useRef<BottomSheetModal>(null);
  const { width } = Dimensions.get("window");
  const [postInput, setPostInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const colorScheme = useColorScheme();
  const postContext = useContext<any>(PostContext);
  const { height } = Dimensions.get("window");
  const {
    getUserPosts,
    forYouPosts,
    getForYouPosts,
    getBaseUrl,
    posts,
    forYouFollowingPosts,
    getAllForYouPosts,
  } = postContext;
  // const [profileImageUri, setProfileImageUri] = useState(``);
  const fadedTextColor = colorScheme === "dark" ? "#525252" : "#bebebe";
  const context = useContext<any>(MyContext);
  const { myInfo, loggedIn } = context;
  const [loading, setLoading] = useState(true);
  const [isForYou, setIsForYou] = useState(true);

  const handleOpenNewPost = () => newPostRef?.current?.present();
  const handleCloseNewPost = () => newPostRef?.current?.dismiss();

  const mortyUrl =
  "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";

  const profileImageUri = useMemo(() => {
    if (myInfo?.id) {
      return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo?.id}?${Date.now()}`;
    }
    return mortyUrl; // Fallback URL
  }, [myInfo?.id]);

  const createPost = async (content: string, userName: string) => {
    if (content.length < 1) return;
    setLoading(true);
    setPostInput("");
    const userEmail = await AsyncStorage.getItem("user");
    try {
      await fetch(`${getBaseUrl()}/api/createPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          email: userEmail,
          userName,
        }),
      });
      await getForYouPosts(myInfo?.id);
      await getAllForYouPosts();
      setLoading(false);
    } catch (error) {
      console.log(error, "this is the create post error");
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (myInfo?.id) {
  //     const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo.id}.jpg?${Date.now()}`;
  //     setProfileImageUri(newProfileImageUri);
  //   }
  // }, [myInfo]);

  useFocusEffect(
    useCallback(() => {
      getUserPosts(myInfo?.email, myInfo?.id);
    }, [myInfo]),
  );

  const loadingPosts = async () => {
    await getForYouPosts(myInfo?.id);
    await getAllForYouPosts();
    setLoading(false);
  };

  useEffect(() => {
    loadingPosts();
  }, [myInfo]); // Refresh when switching between For You and Following

  // const handleError = () => setProfileImageUri(mortyUrl);

  const blurhash = myInfo?.blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe";

  return (
    <ThemedView style={styles.pageContainer}>
      <Header name={"Welcome"} />

      {/* Toggle for For You and Following */}
      <ThemedView style={styles.toggleContainer}>
        <Pressable
          style={[styles.toggleButton, isForYou && styles.activeToggleButton]}
          onPress={() => setIsForYou(true)}
        >
          <Text
            style={[styles.toggleText, isForYou && styles.activeToggleText]}
          >
            For You
          </Text>
        </Pressable>
        <Pressable
          style={[styles.toggleButton, !isForYou && styles.activeToggleButton]}
          onPress={() => setIsForYou(false)}
        >
          <Text
            style={[styles.toggleText, !isForYou && styles.activeToggleText]}
          >
            Following
          </Text>
        </Pressable>
      </ThemedView>

      {loading && (
        <ThemedView
          style={[styles.spinnerContainer, { backgroundColor: fadedTextColor }]}
        >
          <ClipLoader color="#26a7de" />
        </ThemedView>
      )}
      <ThemedView style={styles.desktopCenter}>
        <ThemedView style={styles.desktopRow}>
          <ThemedView style={styles.postContainer}>
            <ThemedView style={styles.desktopHiddenFullscreen}>
              <ThemedView style={styles.repostedRow}>
                {loggedIn ? <><Image
                  style={[styles.profilePic, { margin: 20 }]}
                  source={{
                    uri: profileImageUri,
                  }}
                  // onError={handleError}
                />
                  <TextInput
                    onFocus={() => setIsFocused(false)}
                    onBlur={() => setIsFocused(false)}
                    style={styles.input}
                    value={postInput}
                    multiline={true}
                    textAlignVertical="center"
                    onChangeText={(text) => {
                      setPostInput(text);
                    }}
                    placeholder="What's Happening!?"
                  ></TextInput>
                  <Pressable
                    onPress={() => {
                      createPost(postInput, myInfo.username);
                    }}
                  >
                    <ThemedText style={styles.postButton}>Post!</ThemedText>
                  </Pressable></> : <></>}

              </ThemedView>
            </ThemedView>

            <Animated.ScrollView
              style={{ width: "100%", flex: 1, height: height }}
              showsVerticalScrollIndicator={false}
            >
              {isForYou
                ? Array.isArray(forYouPosts) &&
                forYouPosts.map((post, i) => {
                  if (post.postId) {
                    return (
                      <ThemedView
                        key={post.id}
                        style={{ flexDirection: "column", flex: 1 }}
                      >
                        <ThemedView style={styles.row}>
                          <Ionicons
                            color={colorScheme === "dark" ? "white" : "black"}
                            name="git-compare-outline"
                            size={15}
                          />
                          <ThemedText style={styles.repost}>
                            {post.user.username} Reposted
                          </ThemedText>
                        </ThemedView>
                        <Post
                          key={post.id}
                          post={post.post}
                          isComment={false}
                          setLoading={setLoading}
                        />
                      </ThemedView>
                    );
                  }
                  return (
                    <Post
                      key={post.id}
                      post={post}
                      isComment={false}
                      setLoading={setLoading}
                    />
                  );
                })
                : Array.isArray(forYouFollowingPosts) &&
                forYouFollowingPosts.map((post, i) => {
                  if (post.postId) {
                    return (
                      <ThemedView
                        key={post.id}
                        style={{ flexDirection: "column", flex: 1 }}
                      >
                        <ThemedView style={styles.row}>
                          <Ionicons
                            color={colorScheme === "dark" ? "white" : "black"}
                            name="git-compare-outline"
                            size={15}
                          />
                          <ThemedText style={styles.repost}>
                            {post.user.username} Reposted
                          </ThemedText>
                        </ThemedView>
                        <Post
                          key={post.id}
                          post={post.post}
                          isComment={false}
                          setLoading={setLoading}
                        />
                      </ThemedView>
                    );
                  }
                  return (
                    <Post
                      key={post.id}
                      post={post}
                      isComment={false}
                      setLoading={setLoading}
                    />
                  );
                })}
            </Animated.ScrollView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <CustomBottomSheet
        hideCancelButton
        ref={newPostRef}
        snapPercs={["10%", "10%"]}
      >
        <ThemedView style={styles.commentContainer}>
          <ThemedView style={styles.buttonContainer}>
            <Button title="Cancel" onPress={handleCloseNewPost}></Button>
            <Pressable
              onPress={() => {
                createPost(postInput, myInfo.username);
                handleCloseNewPost();
              }}
              style={styles.postButton}
            >
              <Text style={styles.buttonText}>Post</Text>
            </Pressable>
          </ThemedView>
          <ThemedView
            style={{
              flexDirection: "row",
              display: "flex",
              padding: 20,
              width: "100%",
            }}
          >
            <Image
              style={styles.commentPic}
              source={{
                uri: profileImageUri,
              }}
              placeholder={{ blurhash }}
              transition={500}
            />
            <BottomSheetTextInput
              autoFocus
              onChangeText={(input) => setPostInput(input)}
              multiline
              placeholder="Type your post here"
              style={[
                styles.postInput,
                colorScheme === "dark"
                  ? { color: "#bebebe" }
                  : { color: "#525252" },
              ]}
            />
          </ThemedView>
        </ThemedView>
      </CustomBottomSheet>
      {myInfo ? (
        <Pressable style={styles.addButton} onPress={handleOpenNewPost}>
          <Ionicons size={30} color={"white"} name="add" />
        </Pressable>
      ) : null}
    </ThemedView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  pageContainer: {
    flexDirection: "column",
    flex: 1,
    width: "100%",
    height: '100%',
    // overflow: 'hidden',
    display: "flex",
    alignItems: "center",
  },
  addButton: {
    display: width > 600 ? "none" : "flex",
    position: "absolute",
    bottom: 90,
    right: 10,
    borderRadius: 25,
    height: 40,
    width: 40,
    backgroundColor: "#26a7de",
    justifyContent: "center",
    alignItems: "center",
  },
  desktopHiddenFullscreen: {
    display: width > 600 ? "flex" : "none",
  },
  postInput: {
    maxWidth: "100%",
    width: "100%",
    paddingTop: 15,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  commentContainer: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
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
  commentPic: {
    borderRadius: 25,
    marginRight: 30,
    width: 45,
    height: 45,
  },
  repostedRow: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
    justifyContent: "flex-start",
  },
  profilePic: {
    borderRadius: 15,
    width: 35,
    height: 35,
    paddingBottom: 10,
  },
  input: {
    fontSize: 16,
    color: "gray",
    padding: 10,
    width: "100%",
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeToggleButton: {
    backgroundColor: "#26a7de",
  },
  toggleText: {
    fontSize: 16,
    color: "#333",
  },
  activeToggleText: {
    color: "white",
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
  desktopCenter: {
    width: width > 600 ? "80%" : "100%",
    flex: 1,
    // paddingBottom: 170
  },
  desktopRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    flex: 1,
  },
  postContainer: {
    width: width > 600 ? "100%" : "100%",
    flex: 1,
    height: height,
    paddingBottom: 170,
  },
  row: {
    marginLeft: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  repost: {
    marginLeft: 5,
    fontSize: 14,
  },
});
