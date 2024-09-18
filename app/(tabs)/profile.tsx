import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useRef } from "react";
import { useFocusEffect, router } from "expo-router";
import { useContext } from "react";
import {
  StyleSheet,
  Image,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  Pressable,
  Button,
  Linking
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import MyContext from "../../components/providers/MyContext";
import PostContext from "../../components/providers/PostContext";
import CustomBottomSheet from "@/components/util/CustomBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Post from "@/components/postComponents/Post";
import Animated from "react-native-reanimated";


export default function TabTwoScreen() {
  const navigation = useNavigation();
  const newPostRef = useRef<BottomSheetModal>(null);
  const colorScheme = useColorScheme();
  const [selectedOption, setSelectedOption] = useState("Posts");
  const [user, setUser] = useState<any>();
  const context = useContext<any>(MyContext);
  const [profileImage, setProfileImage] = useState<any>(null);
  const { setLoginToggle, myInfo, loggedIn, updateUser } = context;
  const postContext = useContext<any>(PostContext);
  const { getUserPosts, posts } = postContext;

  const [bio, setBio] = useState(myInfo?.bio || "");
  const [links, setLinks] = useState('');
  const [location, setLocation] = useState(myInfo?.location || "");

  const fadedTextColor = colorScheme === "dark" ? '#525252' : "#bebebe" 

  const handlePress = () => navigation.dispatch(DrawerActions.openDrawer());
  const handleOpenNewPost = () => newPostRef?.current?.present();
  const handleCloseNewPost = () => newPostRef?.current?.dismiss();

  useFocusEffect(
    useCallback(() => {
      getUserPosts(myInfo?.email);
    }, [])
  );

  const renderContent = () => {
    switch (selectedOption) {
      case "Posts":
        return (
          <Animated.ScrollView style={{ height: '72%' }}>
            <ThemedView>
              {Array.isArray(posts.Posts) &&
                posts?.Posts?.map((post: any) => {
                  return <Post key={post.id} post={post} user={myInfo.email} />;
                })}
            </ThemedView>
          </Animated.ScrollView>
        );
      case "Likes":
        return <ThemedText>Reposts</ThemedText>;
      case "Replies":
        return (
          <Animated.ScrollView style={{ height: '72%' }}>
            <ThemedView>
              {myInfo?.comments?.map((comment: any) => {
                return <Post user={myInfo.email} key={comment.id} isComment post={comment} />;
              })}
            </ThemedView>
          </Animated.ScrollView>
        );
      default:
        return null;
    }
  };

  const openLink = (url: string) => {
    // Check if the URL starts with "http" or "https"
    if (!url.startsWith('http')) {
      url = 'https://' + url; // Add protocol if not present
    }
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const handleSave = () => {
    updateUser(myInfo.email, links, location, bio)
    console.log("Bio:", bio);
    console.log("Location:", location);
    handleCloseNewPost();
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.row}>
          {loggedIn ? (
            <Image
              style={styles.profilePic}
              source={{
                uri: "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg",
              }}
            />
          ) : (
            <ThemedText>Empty Photo</ThemedText>
          )}

          <TouchableOpacity style={[styles.button, { borderColor: fadedTextColor }]} onPress={handleOpenNewPost}>
            <ThemedText style={{ fontSize: 12 }}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.close}>
          {loggedIn ? (
            <>
              <ThemedText style={styles.userName}>
                {myInfo?.username}
              </ThemedText>
              <ThemedText style={styles.tag}>@{myInfo?.email}</ThemedText>
              <ThemedText>{myInfo?.bio}</ThemedText>

              {/* Make links clickable */}
              {myInfo?.links && (
                <ThemedText style={{ color: 'blue' }} onPress={() => openLink(myInfo.links)}>
                  {myInfo.links}
                </ThemedText>
              )}
            </>
          ) : (
            <ThemedText>Login </ThemedText>
          )}
        </ThemedView>
        <ThemedView style={styles.followersRow}>
          {loggedIn ? (
            <>
              <ThemedText style={styles.smallGray}>
                {myInfo?.followers.length} Followers
              </ThemedText>
              <ThemedText style={styles.smallGray}>
                {myInfo?.following.length} Following
              </ThemedText>
            </>
          ) : (
            <ThemedText></ThemedText>
          )}
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.column}>
        {["Posts", "Reposts", "Replies"].map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setSelectedOption(option)}
          >
            <ThemedText
              style={[
                styles.optionText,
                selectedOption === option && styles.underline,
              ]}
            >
              {option}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
      <ThemedView style={styles.content}>{renderContent()}</ThemedView>
      <CustomBottomSheet hideCancelButton ref={newPostRef} snapPercs={["35%"]}>
        <ThemedView style={styles.bottomSheetContent}>
          <ThemedText style={styles.bottomSheetTitle}>Edit Profile</ThemedText>
          <TextInput
            style={[
              styles.input,
              { color: colorScheme === "dark" ? "#fff" : "#000" },
            ]}
            placeholder="Bio"
            placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#555"}
            value={bio}
            onChangeText={setBio}
          />
          <TextInput
            style={[
              styles.input,
              { color: colorScheme === "dark" ? "#fff" : "#000" },
            ]}
            placeholder="Links"
            placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#555"}
            value={links}
            onChangeText={setLinks}
          />
          <TextInput
            style={[
              styles.input,
              { color: colorScheme === "dark" ? "#fff" : "#000" },
            ]}
            placeholder="Location"
            placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#555"}
            value={location}
            onChangeText={setLocation}
          />
          <Button title="Save" onPress={handleSave}></Button>
        </ThemedView>
      </CustomBottomSheet>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "space-between",
    alignItems: "baseline",
    width: "100%",
    borderColor: "#525252",
  },
  profilePic: {
    borderRadius: 15,
    width: 35,
    height: 35,
    marginBottom: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
  },
  tag: {
    fontSize: 10,
    marginLeft: 1,
  },
  followersRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
  },
  close: {
    display: "flex",
    flexDirection: "column",
  },
  smallGray: {
    fontSize: 11,
    lineHeight: 18,
    color: "rgb(119 118 118)",
  },
  column: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginLeft: 10,
  },
  optionText: {
    fontSize: 16,
    padding: 10,
  },
  underline: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  content: {
    padding: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "95%",
  },
  button: {
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  bottomSheetContent: {
    padding: 20,
    width: "90%",
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,

    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});
