import { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import {
  StyleSheet,
  Image,
  useColorScheme,
  TouchableOpacity,
  Pressable,
  Alert,
  Linking,
  Platform
} from "react-native"; // Import Alert
import { Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation as useExpoNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useState, useEffect } from "react";
import MyContext from "../../components/providers/MyContext";
import PostContext from "../../components/providers/PostContext";
import Post from "@/components/postComponents/Post";
import { Link, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { ClipLoader } from "react-spinners";
import Animated from "react-native-reanimated";
import UnfollowPopup from "@/components/profileComponents/UnfollowPopup";

export default function ExternalProfile() {
  const navigation = useExpoNavigation();
  const router = useRouter();
  const back = useNavigation();
  const [selectedOption, setSelectedOption] = useState("Posts"); // Track selected option
  const [user, setUser] = useState<any>();
  const { setLoginToggle, myInfo, loggedIn, updateUser, updateFollowers } =
    useContext<any>(MyContext);
  const { getUserPosts, posts, getBaseUrl } = useContext<any>(PostContext);
  const local = useLocalSearchParams();
  const [profileImageUri, setProfileImageUri] = useState("");
  const mortyUrl =
    "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const fadedTextColor = colorScheme === "dark" ? "#525252" : "#bebebe";
  const linkTextColor = colorScheme === "dark" ? "#26a7de" : "#0000EE";
  const [ unfollowVisible, setUnfollowVisible ] = useState(false)
  

  const handleError = () => {
    setProfileImageUri(mortyUrl);
  };

  const handlePress = () => navigation.dispatch(DrawerActions.openDrawer());

  const handleLoading = async () => {
    await getUser();
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      handleLoading();
      return () => {
        setUser("");
      };
    }, [local.profile, myInfo]),
  );

  useEffect(() => {
    if (user?.id) {
      const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${user?.id}?${Date.now()}`;      
      setProfileImageUri(newProfileImageUri);
    }
  }, [user]);

  const getUser = async () => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/users/myInfo?email=${local.profile}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userData = await result.json();
      setUser(userData.user);
    } catch (error) {
      console.log(error, "this is the get user error");
    }
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "Posts":
        return (
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            style={{ height: "100%", flex: 1 }}
          >
            <ThemedView>
              {Array.isArray(user?.posts) &&
                user?.posts?.map((post: any) => {
                  return (
                    <Post
                      key={post?.id}
                      post={post}
                      user={user?.id}
                      setLoading={setLoading}
                    />
                  );
                })}
            </ThemedView>
          </Animated.ScrollView>
        );
      case "Likes":
        return <ThemedText>Reposts</ThemedText>;
      case "Replies":
        return (
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            style={{ height: "100%", flex: 1 }}
          >
            <ThemedView>
              {user?.comments?.map((comment: any) => {
                return (
                  <ThemedView key={comment?.id || comment.content}>
                    <ThemedText style={styles.content}>
                      {comment?.comment}
                    </ThemedText>
                  </ThemedView>
                );
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
    if (!url.startsWith("http")) {
      url = "https://" + url; // Add protocol if not present
    }
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err),
    );
  };


  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const isFollowed = (followers: string[]): boolean => {
    return followers.includes(myInfo?.id);
  };

  // Alert function to confirm unfollow action
  const handleUnfollow = () => {
    if (Platform.OS === 'web') {
      setUnfollowVisible(true)
    } else {
      Alert.alert(
        "Unfollow",
        "Are you sure you want to unfollow?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Unfollow",
            onPress: () =>
              updateFollowers(
                myInfo?.id,
                user?.id,
                user.followers,
                myInfo.following,
              ),
          },
        ],
        { cancelable: false },
      );
    }
  };

  return (
    <ThemedView style={[{ flex: 1 }, styles.pageContainer]}>
      {loading && (
        <ThemedView
          style={[styles.spinnerContainer, { backgroundColor: fadedTextColor }]}
        >
          <ClipLoader color="#26a7de" />
        </ThemedView>
      )}
      <ThemedView style={styles.desktopCenter}>
        <ThemedView style={styles.header}>
          <Pressable
            onPress={() => {
              router.back();
            }}
          >
            <ThemedView
              style={[styles.icon]}
            >
              <Ionicons size={25} name="arrow-back-outline" />
            </ThemedView>
          </Pressable>
          <ThemedView
            style={[
              styles.backgroundColor,
              { backgroundColor: user?.color || "#fff" },
            ]}
          ></ThemedView>
          <ThemedView style={styles.row}>
            <Image
              style={styles.profilePic}
              source={{ uri: profileImageUri }}
              onError={handleError}
            />
            {user && myInfo && myInfo.email !== user.email ? (
              isFollowed(user.followers) ? (
                <Pressable onPress={handleUnfollow}>
                  <Ionicons
                    size={25}
                    style={styles.followIcon}
                    name={"checkmark-done-circle-outline"}
                    color={colorScheme === "dark" ? "white" : "black"}
                  ></Ionicons>
                </Pressable>
              ) : (
                <Pressable
                  onPress={async () => {
                    setLoading(true)
                    await updateFollowers(
                      myInfo.id,
                      user.id,
                      user.followers,
                      myInfo.following,
                    );
                    setLoading(false)
                  }}
                >
                  <ThemedText style={styles.button}>Follow</ThemedText>
                </Pressable>
              )
            ) : null}
          </ThemedView>
          <ThemedView style={styles.close}>
            <>
              <ThemedText style={styles.userName}>{user?.username}</ThemedText>
              <ThemedText style={styles.tag}>{user?.bio}</ThemedText>
              {myInfo?.links && (
                <ThemedText
                  style={[styles.link, { color: linkTextColor }]}
                  onPress={() => openLink(user?.links)}
                >
                  {user?.links}
                </ThemedText>
              )}
            </>
          </ThemedView>
          <ThemedView style={styles.followersRow}>
            <>
              <ThemedText style={styles.smallGray}>
                {user?.followers?.length} Followers
              </ThemedText>
              <ThemedText style={styles.smallGray}>
                {user?.following?.length} Following
              </ThemedText>
            </>
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
        {renderContent()}
      </ThemedView>
      <UnfollowPopup setLoading={setLoading} setUnfollowVisible={setUnfollowVisible} unfollowVisible={unfollowVisible} myInfo={myInfo} user={user} updateFollowers={updateFollowers}/>
    </ThemedView>
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "space-between",
    alignItems: "baseline",
    width: "100%",

    borderColor: "#525252",
  },
  profilePic: {
    borderRadius: 50,
    width: 75,
    height: 75,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
  },
  pageContainer: {
    flexDirection: "column",
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  tag: {
    fontSize: 14,
    marginLeft: 1,
    paddingBottom: 5,
    paddingTop: 5,
  },
  locationRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  followersRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 2,
    width: "45%",
  },
  close: {
    display: "flex",
    flexDirection: "column",
  },
  smallGray: {
    fontSize: 13,
    lineHeight: 18,
    color: "rgb(119 118 118)",
  },
  smallGrayDate: {
    fontSize: 11,
    lineHeight: 18,
    color: "rgb(119 118 118)",
  },
  column: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    borderBottomColor: 'rgb(232,232,232)',
    borderBottomWidth: .5,
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
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    width: "95%",
  },
  desktopCenter: {
    width: width > 600 ? "100%" : "100%",
    flex: 1,
  },
  button: {
    width: 55,
    fontSize: 12,
    height: 30,
    borderRadius: 15,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
    textAlign: "center",
  },

  black: {
    color: "black",
    backgroundColor: "black",
  },
  link: {
    fontSize: 13
  },
  icon: {
    padding: 8,
    zIndex: 100,
    backgroundColor: 'transparent'
  },
  backgroundColor: {
    position: "absolute",
    top: 0,
    backgroundColor: 'transparent',
    left: 0,
    height: "15%",
    width: "100%",
    zIndex: -1,
  },
  followIcon: {},
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
