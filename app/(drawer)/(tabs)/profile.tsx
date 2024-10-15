import { useCallback, useRef } from "react";
import { useFocusEffect, router } from "expo-router";
import { useContext } from "react";
import {
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Linking,
  Platform,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState, useEffect } from "react";
import MyContext from "../../../components/providers/MyContext";
import PostContext from "../../../components/providers/PostContext";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Post from "@/components/postComponents/Post";
import Animated from "react-native-reanimated";
import EditProfileSheet from "@/components/profileComponents/EditProfileSheet";
import { Image } from "expo-image";
import { ClipLoader } from "react-spinners";

export default function TabTwoScreen() {
  const editProfileRef = useRef<BottomSheetModal>(null);
  const colorScheme = useColorScheme();
  const [selectedOption, setSelectedOption] = useState("Posts");
  const context = useContext<any>(MyContext);
  const { setLoginToggle, myInfo, loggedIn, updateUser } = context;
  const postContext = useContext<any>(PostContext);
  const { getUserPosts, posts, getBaseUrl } = postContext;
  const [profileImageUri, setProfileImageUri] = useState(``);
  const [loading, setLoading] = useState(true);

  const fadedTextColor = colorScheme === "dark" ? "#525252" : "#bebebe";
  const linkTextColor = colorScheme === "dark" ? "#26a7de" : "#0000EE";
  const mortyUrl =
    "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";

  const handleOpenEditProfile = () => editProfileRef?.current?.present();

  const handleError = () => {
    setProfileImageUri(mortyUrl);
  };

  const handleLoading = async () => {
    await getUserPosts(myInfo?.email, myInfo?.id);
    setLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      handleLoading()
    }, [myInfo]),
  );

  useEffect(() => {
    if (myInfo?.id) {
      const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo.id}?${Date.now()}`;
      console.log(newProfileImageUri)
      setProfileImageUri(newProfileImageUri);
    }
  }, [myInfo]);

  const renderContent = () => {
    switch (selectedOption) {
      case "Posts":
        return (
          <Animated.ScrollView style={{ height: "72%" }}>
            <ThemedView>
              {Array.isArray(posts.posts) &&
                posts?.posts?.map((post: any) => {
                  return (
                    <Post key={post.id} post={post} user={myInfo?.email} setLoading={setLoading}/>
                  );
                })}
            </ThemedView>
          </Animated.ScrollView>
        );
      case "Reposts":
        return (
          <Animated.ScrollView style={{ height: "72%" }}>
            <ThemedView>
              {Array.isArray(posts.reposts) &&
                posts?.reposts?.map((post: any) => {
                  return (
                    <Post
                      repostLength={posts?.reposts.length}
                      key={post.id}
                      post={post.post}
                      user={post.post.email}
                      setLoading={setLoading}
                    />
                  );
                })}
            </ThemedView>
          </Animated.ScrollView>
        );
      case "Replies":
        return (
          <Animated.ScrollView style={{ height: "72%" }}>
            <ThemedView>
              {myInfo?.comments?.map((comment: any) => {
                return (
                  <Post
                    user={myInfo?.email}
                    key={comment.id}
                    isComment
                    post={comment}
                    setLoading={setLoading}
                  />
                );
              })}
            </ThemedView>
          </Animated.ScrollView>
        );
      default:
        return null;
    }
  };
  const blurhash = myInfo?.blurhash || 'U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe'
  const openLink = (url: string) => {
    // Check if the URL starts with "http" or "https"
    if (!url.startsWith("http")) {
      url = "https://" + url; // Add protocol if not present
    }
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err),
    );
  };

  return (
    <ThemedView style={[{ flex: 1 }, Platform.OS === 'web' ? { marginTop: 0 } : { marginTop: -70 }, styles.pageContainer]}>
      {loading && (
        <ThemedView
          style={[styles.spinnerContainer, { backgroundColor: fadedTextColor }]}
        >
          <ClipLoader color="#26a7de" />
        </ThemedView>
      )} 
      <ThemedView style={styles.desktopCenter}>
        <ThemedView style={styles.desktopRow}>
          <ThemedView style={styles.contentMiddle}>
            <ThemedView style={styles.header}>
              <ThemedView style={styles.close}>
                <ThemedView
                  style={[
                    { backgroundColor: myInfo?.color || "#fff" },
                  ]}
                ></ThemedView>
                <ThemedView style={styles.row}>
                  {loggedIn ? (
                    <Image
                      style={styles.profilePic}
                      source={{
                        uri: profileImageUri,
                      }}
                      placeholder={{ blurhash }}
                      transition={500}
                    />
                  ) : (
                    <Image
                      style={styles.profilePic}
                      source={{
                        uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKsAAACUCAMAAADbGilTAAAAM1BMVEXk5ueutLeqsLPO0tTn6erh4+Tq7O3a3d6xt7rU19m/xMbEyMvJzc/d4OG5vsG9wcSkq6+UDpwhAAAD9ElEQVR4nO2b13LcMAwAWSBWibr//9pQvhJdZxNAj7l5iJOnHRiEWADGBoPBYDAYDAaDwWAw+LsAAGPTxvnHbgGYtJy9WyPOS6tZr7oA0gXDhRA8sv1lgtOgqL2eAKbXs+Q9gruF9RVcsOsL0bOtcLajVFDLyt+pnmM7dSILzH8QvSC7kAUdvqtysXYQWrAmQTXKGk0uK1NEz7aWVhbmpKD2IAsyQzViKVWzTGNkyXIWbF5UN1miagAs1zQSSFQZuOywxsB6EtW5IKxEKTuZIldu8DeJKmET8DqwM3pgp1OZagzsgqwKa6kq5zOyqi5X5WbCdS3N1g2Bu5ktLQKXwKKWgvyv611gMVeXensSTMMjBhbqVLlBTNil0pVrNNXCrcAOvEqgQqWq8GiuUFWxNhza52Cpdg1YrmCrXdH2L2BrVfEKQfbxldK1umRxgXVTMFyHawvXUQdeuP6i+sp0/XcL73j4e/YDTNW6It7AKVcbV7x7ooJL4nsM5stB8WXWBcSbl9qEXTHP3JnvLw/gPh4tVWEVuDewJW8FN1W8U+xG1ZYAbeNypXx1CYesWlNi0Z9lVbFqQH/bKA7sCfcG/izri1QF5t3rjbKbIrzd4J6yLCDqdyh4OkR+gtmT+yAnHF0XSebTkVjJTDfSGp6uUSVVhSWlkeymStyhNaU+dQlP3/mmElu0uugoBPs9D0Sg79D7ASb/5awoZvrf/5W4xD6prtSL6g5Q1r0sX0IY38mv/z/AFhkeO7aFWOXSUQP0DmDa775kwduufvmPKAWTthE9gepZdMvbO3qUhZ+BkklL6d0agol/QnB+llt4+8nXaLJoK33g4iQe1lb8d/xPs85Wb860ogoW69eo+fnDFZXN6qWmy2BQes5rejAkExwxOa3np/wzjAgSdz4GwPqnup+sa5ycsM7dCmT4NP7y3ZYbj2EbV70vjehe9xTs0Vsv0K4qpHvdII9MXMWamf4Q7GGZ8HVLnU08LhwRW2Ay53ydbOuX5rIw1fa6vZM1jRMBWM48Ua5taBnaGNTjVLd6266jRCWOvlXQ6i05a56sEGHauDavVK9lW5x2K1uzk2nwTn/oqrqjcgIJpsNX1V62KrLH1qpnKmQBWbViSKJoSK+Swk8YRl19ouyprmrsqZiyPoiJQrXsta52PKec7HNYi17MQrLfFuvHHcrJzAKSGnAlt+GUzjR3eSmCr8BeNisJSFWzRpNVWStLOzK+XnUTpS1IzljC2noho9OgZqi4Dclliz4F0mdQNHlY05t4KL9ZN9IuuaonSltwSgurwri7+EZiPy/04Jp4w6W7cHVJCWu3d1Vy0jp6teyBxAILXZDmOvhb/AN6bzfTexgP5QAAAABJRU5ErkJggg==',
                      }}
                      placeholder={{ blurhash }}
                      transition={500}
                    />
                  )}
                  {loggedIn ? (
                    <TouchableOpacity
                      style={[styles.button, { borderColor: fadedTextColor }]}
                      onPress={handleOpenEditProfile}
                    >
                      <ThemedText style={{ fontSize: 12 }}>Edit Profile</ThemedText>
                    </TouchableOpacity>
                  ) : (
                    <ThemedText></ThemedText>
                  )}
                </ThemedView>
                {loggedIn ? (
                  <ThemedView style={styles.columnLeftPadding}>
                    <ThemedText style={styles.userName}>
                      {myInfo?.username}
                    </ThemedText>
                    {/* <ThemedText style={styles.tag}>@{myInfo?.userName}</ThemedText> */}
                    <ThemedText style={styles.bio}>{myInfo?.bio}</ThemedText>
                    {myInfo?.links && (
                      <ThemedText
                        style={[styles.link, { color: linkTextColor }]}
                        onPress={() => openLink(myInfo.links)}
                      >
                        {myInfo.links}
                      </ThemedText>
                    )}
                  </ThemedView>
                ) : (
                  <ThemedText style={styles.bio}>
                    <TouchableOpacity onPress={() => router.push('/login')}>
                      <ThemedText style={styles.linkText}>Create </ThemedText>
                    </TouchableOpacity>{" "}
                    an account or{" "}
                    <TouchableOpacity onPress={() => router.push('/login')}>
                      <ThemedText style={styles.linkText}>Login</ThemedText>
                    </TouchableOpacity>{" "}
                    to see full functionality!
                  </ThemedText>

                )}
              </ThemedView>
              <ThemedView style={styles.followersRow}>
                {loggedIn ? (
                  <>
                    <ThemedText style={styles.smallGray}>
                      {myInfo?.followers?.length} Followers
                    </ThemedText>
                    <ThemedText style={styles.smallGray}>
                      {myInfo?.following?.length} Following
                    </ThemedText>
                  </>
                ) : (
                  <ThemedText></ThemedText>
                )}
              </ThemedView>
            </ThemedView>
            {loggedIn ? <ThemedView style={styles.column}>
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
            </ThemedView> : <ThemedView style={styles.column}>
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

            </ThemedView>}
          </ThemedView>
          <ThemedView style={styles.content}>{renderContent()}</ThemedView>
          <EditProfileSheet
            setProfileImageUri={setProfileImageUri}
            currProfileImage={profileImageUri}
            editProfileRef={editProfileRef}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    paddingTop: 20,
    paddingBottom: width < 600 ? 0 : 20,
    justifyContent: "space-between",
    alignItems: "baseline",
    width: "100%",
    borderColor: "#525252",
  },
  profilePic: {
    borderRadius: 25,    
    margin: 5,
    // marginTop: width < 700 ? 0 : 60,
    width: 55,
    height: 55,
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
    width: '30%',
    paddingLeft: 10,
  },
  close: {
    display: "flex",
    flexDirection: "column",
    ...(Platform.OS === 'web' && {
      width: '100%'
    })
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
    width: "100%",
    borderColor: "rgb(232,232,232)",
    borderBottomWidth: 0.5,
  },
  realColumn: {
    display: 'flex',
    flexDirection: 'column',
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
  contentMiddle: {
    width: '100%'
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "95%",
    backgroundColor: "transparent",
    paddingLeft: 10,
  },
  columnLeftPadding: {
    paddingLeft: 10,
  },
  button: {
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    marginTop: width < 600 ? 0 : 90,
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
  link: {
    fontSize: 10,
  },
  bio: {
    fontSize: 17,
    padding: 5
  },
  // backgroundColor: {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   height: "40%",
  //   width: "110%",
  //   zIndex: -1,
  // },
  center: {

  },
  desktopHiddenBorder: {
    display: width > 600 ? 'flex' : 'none',    
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: 'rgb(232,232,232)',
    borderRadius: 10,
    padding: 15
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  highlightButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkText: {
    color: '#007bff',
    fontSize: 17,
  },
  desktopCenter: {
    width: width > 600 ? '75%' : '100%'
  },
  pageContainer: {
    flexDirection: "column",
    flex: 1,
    display: 'flex',
    alignItems: 'center'
  },
  desktopRow: {
    flexDirection:  'column',
    width: '100%',
    justifyContent: 'space-evenly'
  },
  sectionHeader: {
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 10,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileCardText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  profileButton: {
    backgroundColor: 'rgb(38,102,193)', // LinkedIn Blue
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
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
  },
});
