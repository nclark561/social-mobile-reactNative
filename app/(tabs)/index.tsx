import {
  StyleSheet,
  Pressable,
  Button,
  useColorScheme,
  Text,
  Image,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useContext, useCallback } from "react";
import Animated from "react-native-reanimated";
import Post from "@/components/postComponents/Post";
import Header from "@/components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomBottomSheet from "@/components/util/CustomBottomSheet";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import PostContext from "@/components/providers/PostContext";
import MyContext from "@/components/providers/MyContext";
import { useFocusEffect } from "expo-router";

export default function HomeScreen() {
  const newPostRef = useRef<BottomSheetModal>(null);
  const [postInput, setPostInput] = useState("");
  const colorScheme = useColorScheme();
  const postContext = useContext<any>(PostContext);
  const { getUserPosts, forYouPosts, getForYouPosts } = postContext;

  const context = useContext<any>(MyContext);
  const { myInfo } = context;

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
    try {
      const test = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/createPost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            email: userEmail,
            userName,
          }),
        }
      );
      await getForYouPosts();
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  useFocusEffect(
    useCallback(() => {
      getForYouPosts();
      getUserPosts(myInfo?.email);
    }, [myInfo])
  );

  console.log(forYouPosts, 'my info')

  return (
    <ThemedView style={styles.pageContainer}>
      <Header name="Posts" />
      <Animated.ScrollView>
        {Array.isArray(forYouPosts) &&
          forYouPosts.map((post, i) => (
            <Post key={i} post={post} isComment={false} />
          ))}
      </Animated.ScrollView>
      <Pressable style={styles.addButton} onPress={handleOpenNewPost}>
        <Ionicons size={30} color={"white"} name="add" />
      </Pressable>
      <CustomBottomSheet hideCancelButton ref={newPostRef} snapPercs={["95%"]}>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flexDirection: "column",
    height: "110%",
  },
  addButton: {
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
  postInput: {
    maxWidth: "80%",
    paddingTop: 15,
  },
});
