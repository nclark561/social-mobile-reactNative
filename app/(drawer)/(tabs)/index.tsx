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
      const newProfileImageUri = `${
        process.env.EXPO_PUBLIC_SUPABASE_URL
      }/storage/v1/object/public/profile-images/${id}.jpg?${Date.now()}`;
      return newProfileImageUri;
    }
  };

  const createPost = async (content: string, userName: string) => {
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
      await getForYouPosts();
    } catch (error) {
      console.log(error, "this is the create post error");
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
            <Animated.ScrollView
              style={{ position: "relative" }}
              showsVerticalScrollIndicator={false}
            >              
              {isForYou
                ? Array.isArray(forYouPosts) &&
                  forYouPosts.map((post, i) => (                   
                    <Post key={post.id} post={post} isComment={false} />
                  ))
                : Array.isArray(forYouFollowingPosts) &&
                  forYouFollowingPosts.map((post: any) => (                    
                    <Post key={post.id} post={post} isComment={false} />
                  ))}
            </Animated.ScrollView>
          </ThemedView>
        </ThemedView>
      </ThemedView>

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
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
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
});
