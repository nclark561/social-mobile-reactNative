import { StyleSheet, Pressable, Button, useColorScheme, Text, Image } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import Animated from "react-native-reanimated";
import Post from "@/components/postComponents/Post";
import Header from "@/components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomBottomSheet from "@/components/util/CustomBottomSheet";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";

const post1 = {
  user: "Noah Clark",
  profilePic: "https://avatars.githubusercontent.com/u/125314332?v=4",
  text: "I'm making a social media app. I am typing a bunch of random stuff to create a fake twitter post. this is the best post i ever made. I'm making a social media app. I am typing a bunch of random stuff to create a fake twitter post. this is the best post i ever made. I'm making a social media app. I am typing a bunch of random stuff to create a fake twitter post. this is the best post i ever made. I'm making a social media app. I am typing a bunch of random stuff to create a fake twitter post. this is the best post i ever made.",
};

const post2 = {
  user: "Morty Smith",
  profilePic:
    "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg",
  text: "You cant keep doing this Rick. Ive almost died 3 times this week, Im exhausted, and I havent been able to go to school in months. Enough is enough.",
};

const posts = [post1, post2, post1, post2, post1, post2, post1, post2, post1];



export default function HomeScreen() {
  const newPostRef = useRef<BottomSheetModal>(null);
  const [postInput, setPostInput] = useState('')
  const colorScheme = useColorScheme()

  const handleOpenNewPost = () => newPostRef?.current?.present();
  const handleCloseNewPost = () => newPostRef?.current?.dismiss();

  return (
    <ThemedView style={styles.pageContainer}>
      <Header name="Posts" />
      <Animated.ScrollView>
        {posts.map((e, i) => (
          <Post key={i} post={e} />
        ))}
      </Animated.ScrollView>
      <Pressable style={styles.addButton} onPress={handleOpenNewPost}>
        <Ionicons size={30} color={"white"} name="add" />
      </Pressable>
      <CustomBottomSheet hideCancelButton ref={newPostRef} snapPercs={["95%"]}>
        <ThemedView style={styles.commentContainer}>
          <ThemedView style={styles.buttonContainer}>
            <Button title="Cancel" onPress={handleCloseNewPost}></Button>
            <Pressable onPress={() => {}} style={styles.postButton}>
              <Text style={styles.buttonText}>Post</Text>
            </Pressable>
          </ThemedView>
          <ThemedView style={{ flexDirection: "row" }}>
            <Image
              style={styles.commentPic}
              source={{ uri: post1.profilePic }}
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
                  : { color: "#525252" }
              ]
              }
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
    maxWidth: '80%',
    paddingTop: 15
  }
});
