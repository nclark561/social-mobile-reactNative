import {
  StyleSheet,
  Pressable,
  Button,
  useColorScheme,
  Text,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useContext, useCallback, useEffect } from "react";
import Animated from "react-native-reanimated";
import Post from "@/components/postComponents/Post";
import Header from "@/components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomBottomSheet from "@/components/util/CustomBottomSheet";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostContext from "@/components/providers/PostContext";
import MyContext from "@/components/providers/MyContext";
import { useFocusEffect } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ClipLoader } from "react-spinners";

export default function HomeScreen() {
  const newPostRef = useRef<BottomSheetModal>(null);
  const { width } = Dimensions.get("window");
  const [postInput, setPostInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const colorScheme = useColorScheme();
  const postContext = useContext<any>(PostContext);
  const { getUserPosts, forYouPosts, getForYouPosts, getBaseUrl, posts, forYouFollowingPosts, getAllForYouPosts } =
    postContext;
  const [profileImageUri, setProfileImageUri] = useState(``);
  const fadedTextColor = colorScheme === "dark" ? "#525252" : "#bebebe";
  const context = useContext<any>(MyContext);
  const { myInfo } = context;
  const [loading, setLoading] = useState(true);
  const [isForYou, setIsForYou] = useState(true);
  const handleOpenNewPost = () => newPostRef?.current?.present();
  const handleCloseNewPost = () => newPostRef?.current?.dismiss();

  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL
        }/storage/v1/object/public/profile-images/${id}.jpg?${Date.now()}`;
      return newProfileImageUri;
    }
  };

  const createPost = async (content: string, userName: string) => {
    const userEmail = await AsyncStorage.getItem("user");
    setLoading(true)
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
      setPostInput('')
      await getForYouPosts();
      await getAllForYouPosts()
      setLoading(false)
    } catch (error) {
      console.log(error, "this is the create post error");
      setLoading(false)
    }
  };

  useEffect(() => {
    if (myInfo?.id) {
      const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo.id}.jpg?${Date.now()}`;
      setProfileImageUri(newProfileImageUri);
    }
  }, [myInfo]);

  useFocusEffect(
    useCallback(() => {
      getUserPosts(myInfo?.email, myInfo?.id);
    }, [myInfo])
  );

  const loadingPosts = async () => {
    await getForYouPosts(myInfo?.id);
    await getAllForYouPosts(myInfo?.id)
    setLoading(false);
  };

  useEffect(() => {
    loadingPosts();
  }, [myInfo]); // Refresh when switching between For You and Following

  const mortyUrl =
    "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";
  const handleError = () => setProfileImageUri(mortyUrl);


  const blurhash = myInfo?.blurhash || 'U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe'

  return (
    <ThemedView style={styles.pageContainer}>
      <Header name={"Welcome"} />

      {/* Toggle for For You and Following */}
      <ThemedView style={styles.toggleContainer}>
        <Pressable
          style={[
            styles.toggleButton,
            isForYou && styles.activeToggleButton,
          ]}
          onPress={() => setIsForYou(true)}
        >
          <Text
            style={[
              styles.toggleText,
              isForYou && styles.activeToggleText,
            ]}
          >
            For You
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.toggleButton,
            !isForYou && styles.activeToggleButton,
          ]}
          onPress={() => setIsForYou(false)}
        >
          <Text
            style={[
              styles.toggleText,
              !isForYou && styles.activeToggleText,
            ]}
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
                <Image
                  style={[styles.profilePic, { margin: 20 }]}
                  source={{
                    uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAACUCAMAAAAEVFNMAAAAMFBMVEXk5ueutLe+wsXn6eqrsbTU19nh4+S4vcDHy820ubzR1Nbc3+DAxcfM0NLq7O3Z3N2JvUspAAAENklEQVR4nO2c23LjIAxAbYursfH//+2CkybNHZAi0R2fh047+3JGI4MAaYfh4ODg4ODg4ODg4ODg4ODvAjAMJnH+tW+SYdjm1S0Zt85bGHp2Btjc5Ed1ZbTTGnqNM8Dqx1GNt6S//dyjMgSn7mWv0inM0oK3gHEPsb1R9mtXyRy1f6e7K9stSmv+AMPySXdXXjqJMYSP4f0JcpB2zcDndLgY+00+yKBLdXdl+dWiyjcZC8e4Lr4Zv4n6br7SN+WxERQ2xd/bb2O59ThO9b7J2EmlMcwtvgktYwymOoHPIbZCaVy0IT81lkmKrVE3G0uEGJq+uLPwIrBSbO2+Cf4QR4sS5i81Dcp39NyVJjiU76hm5hAbixSeeLMYNM535P7sYMWlcAqxZhU2zbvcRZh3nWgtI37DuncEbIBTiFkjXH0yeiLMeVYCRyC8MoYYU/hc4CyAgOCbGydG4UghbDmFCXxHz5jDkSCFD+H/S5jAd7Scwn9tWQNk+b7DunFQbM2stymtt2q/hVlv2HCXEidh1jOSQfuOirWAxx6a8xUm720V+qtjLYcRd9lXYearn4DdOrgvtWFCBtjx+jY80N3B/sAION+JWRd9WcV9eZnBfHactfAFxMrGfju8Y5ofDdQk8uwFc3OEhV70W8t4ueaftqVNWSHd1ocDyTaalqOSzApxofrpgL2IuKP24lWuu+NClbFapHWHKmPpfDhR/uUxH4teEuei5irlhXp9HoFQkBZqkW9jvJIOpZ+UuwnvCRicf91Srrzrrw0ewmqfKitlu2uBPwFmW9Sdc/rTbaZL3R2IYZ78+fDkvV9WE/u1PQExT8torTczxO5t8/gJxCvQ37d2IbsZneeQJmut9+nHNOVxJGM6086iQa+LPQ8h3X5zO35a9RZMD9NfEYJ2J9e321z6Zz+5eRtEszqtCc7m6a4Pm9x1ifN20SDToZ3y4HHVLdO22rAPJoHRrjiyT5yXmXXKLhpn3w53FSj7ZeNSBrM8zvk1OI+Wo4BLu9jzEqfNWX+5zADQC5nurvzdwcCcDJS6u7L92sUKmNdTnzjlr7x3wFA+N1drrBx9Kqds+Ep4z8pWE29/Ed/g/AHSdg/Atwt/RFm6cx8E3AhEofE4EwU5BvK17IUyzc0mQX9+sTHF+yisbL77sAQ2yJGgf6rG2CJ3avz4Q7UxKsbsvsg8Rrx1YoybQwxBwDevbq3rMcV0SZNx68sCxShBE23j8AIf3A9tr9HIkUSccUMakzRhtxtXl26CCbFT3W8utUJcqDyaUrRgo6id30e3VuKNqxZj6QzOVLW2IfsUSagZEER3gpJQ0cIdKcY08JS3RBO05BNQfiZlPca9obiUJ5n4JKC4aMPPPBBReEPf8N8jfQe1FmYEwaARCWop25572OZOlNYT0oXPlULhSfVC4dbhpl4oFIZuKPPtm3+Mgjt8yd+5mgAAAABJRU5ErkJggg==",
                  }}
                  onError={handleError}
                />
                <TextInput
                  onFocus={() => setIsFocused(false)}
                  onBlur={() => setIsFocused(false)}
                  style={styles.input}
                  value={postInput}
                  onChangeText={(text) => {
                    setPostInput(text)
                  }}
                  placeholder="What's Happening!?"
                ></TextInput>
                <Pressable onPress={() => { createPost(postInput, myInfo.username) }}>
                  <ThemedText>Post!</ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
            <Animated.ScrollView
              style={{ position: "relative" }}
              showsVerticalScrollIndicator={false}
            >
              {isForYou
                ? Array.isArray(forYouPosts) &&
                forYouPosts.map((post, i) => {
                  if (post.postId) {
                    return (
                      <ThemedView key={post.id} style={{ flexDirection: "column" }}>
                        <ThemedView style={styles.row}>
                          <Ionicons color={colorScheme === 'dark' ? 'white' : 'black'} name="git-compare-outline" size={15} />
                          <ThemedText style={styles.repost}>
                            {post.user.username} Reposted
                          </ThemedText>
                        </ThemedView>
                        <Post key={post.id} post={post.post} isComment={false} />
                      </ThemedView>
                    );
                  }
                  return <Post key={post.id} post={post} isComment={false} />;
                })
                : Array.isArray(forYouFollowingPosts) &&
                forYouFollowingPosts.map((post, i) => {
                  if (post.postId) {
                    return (
                      <ThemedView key={post.id} style={{ flexDirection: "column" }}>
                        <ThemedView style={styles.row}>
                          <Ionicons color={colorScheme === 'dark' ? 'white' : 'black'} name="git-compare-outline" size={15} />
                          <ThemedText style={styles.repost}>
                            {post.user.username} Reposted
                          </ThemedText>
                        </ThemedView>
                        <Post key={post.id} post={post.post} isComment={false} />
                      </ThemedView>
                    );
                  }
                  return <Post key={post.id} post={post} isComment={false} />;
                })}
            </Animated.ScrollView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <CustomBottomSheet hideCancelButton ref={newPostRef} snapPercs={["10%", "10%"]}>
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
          <ThemedView style={{ flexDirection: "row" }}>
            <Image
              style={styles.commentPic}
              source={{
                uri: `${profileImage(myInfo?.id)}`,
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

      <Pressable style={styles.addButton} onPress={handleOpenNewPost}>
        <Ionicons size={30} color={"white"} name="add" />
      </Pressable>
    </ThemedView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  pageContainer: {
    flexDirection: "column",
    flex: 1,
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
    maxWidth: "80%",
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
  commentPic: {
    borderRadius: 25,
    width: 25,
    height: 25,
    margin: 10,
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
    marginBottom: 10,
  },
  input: {
    fontSize: 20,
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
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
  },
  desktopCenter: {
    width: width > 600 ? "80%" : "100%",
  },
  desktopRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  postContainer: {
    width: width > 600 ? "100%" : "100%",
  },
  row: {
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  repost: {
    marginLeft: 5
  }
});
