import { useCallback, useRef } from "react";
import { useFocusEffect, router } from "expo-router";
import { useContext } from "react";
import {
  StyleSheet,
  Image,
  useColorScheme,
  TouchableOpacity,
  Linking
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState, useEffect } from "react";
import MyContext from "../../components/providers/MyContext";
import PostContext from "../../components/providers/PostContext";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Post from "@/components/postComponents/Post";
import Animated from "react-native-reanimated";
import EditProfileSheet from "@/components/profileComponents/EditProfileSheet";


export default function TabTwoScreen() {
  const editProfileRef = useRef<BottomSheetModal>(null);
  const colorScheme = useColorScheme();
  const [selectedOption, setSelectedOption] = useState("Posts");
  const context = useContext<any>(MyContext);
  const { setLoginToggle, myInfo, loggedIn, updateUser } = context;
  const postContext = useContext<any>(PostContext);
  const { getUserPosts, posts } = postContext;
  const [profileImageUri, setProfileImageUri] = useState(``)

  const fadedTextColor = colorScheme === "dark" ? '#525252' : "#bebebe"
  const mortyUrl = 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg'

  const handleOpenEditProfile = () => editProfileRef?.current?.present();

  const handleError = () => {
    setProfileImageUri(mortyUrl);
  };

  useFocusEffect(
    useCallback(() => {
      console.log(myInfo?.email, 'this is email on profile apge')
      getUserPosts(myInfo?.email);
    }, [myInfo])
  );


  useEffect(() => {
    if (myInfo?.id) {
        const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo.id}.jpg?${Date.now()}`;
        setProfileImageUri(newProfileImageUri);
    }
  }, [myInfo]);


  const renderContent = () => {
    switch (selectedOption) {
      case "Posts":
        return (
          <Animated.ScrollView style={{ height: '72%' }}>
            <ThemedView>
              {Array.isArray(posts.Posts) &&
                posts?.Posts?.map((post: any) => {
                  return <Post key={post.id} post={post} user={myInfo?.email} />;
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
                return <Post user={myInfo?.email} key={comment.id} isComment post={comment} />;
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
  
  

  return (
    <ThemedView style={{ flex: 1, marginTop: -70 }}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.close}>
          <ThemedView style={[styles.backgroundColor, { backgroundColor: myInfo?.color || '#fff' }]}></ThemedView>
          <ThemedView style={styles.row}>
            {loggedIn ? (
              <Image
              
                style={styles.profilePic}
                source={{
                  uri: profileImageUri,
                  cache: 'reload'
                }}
                onError={handleError}
              />
            ) : (
              <ThemedText>Empty Photo</ThemedText>
            )}

            <TouchableOpacity style={[styles.button, { borderColor: fadedTextColor }]} onPress={handleOpenEditProfile}>
              <ThemedText style={{ fontSize: 12 }}>Edit Profile</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          {loggedIn ? (
            <ThemedView style={styles.columnLeftPadding}>
              <ThemedText style={styles.userName}>
                {myInfo?.username}
              </ThemedText>
              {/* <ThemedText style={styles.tag}>@{myInfo?.userName}</ThemedText> */}
              <ThemedText style={styles.bio}>{myInfo?.bio}</ThemedText>
              {myInfo?.links && (
                <ThemedText style={styles.link} onPress={() => openLink(myInfo.links)}>
                  {myInfo.links}
                </ThemedText>
              )}
            </ThemedView>
          ) : (
            <ThemedText>Login </ThemedText>
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
      <EditProfileSheet setProfileImageUri={setProfileImageUri} currProfileImage={profileImageUri} editProfileRef={editProfileRef} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    paddingTop: 20,
    paddingBottom: 20,        
    justifyContent: "space-between",
    alignItems: "baseline",
    width: "100%",
    borderColor: "#525252",
  },
  profilePic: {
    borderRadius: 25,
    marginTop: 60,
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
    width: "40%",
    paddingLeft: 10
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
    backgroundColor: 'rgba(255, 255, 255, 0)',
    paddingLeft: 10
  },
  columnLeftPadding: {
    paddingLeft: 10
  },
  button: {
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    marginTop: 90
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
    color: '#0000EE',
    fontSize: 10
  },
  bio: {
    fontSize: 13
  },
  backgroundColor: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '40%',
    width: '110%',
    zIndex: -1,
  },
});
