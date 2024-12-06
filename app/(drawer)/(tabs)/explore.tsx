import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  TextInput,
  useColorScheme,
  Pressable,
  Dimensions,
} from "react-native";
import { useMemo, useContext, useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation, router } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import ProfileDisplay from "@/components/exploreComponents/ProfileDisplay";
import Animated from "react-native-reanimated";
import PostContext from "@/components/providers/PostContext";
import MyContext from "../../../components/providers/MyContext";
import { Image } from "expo-image";
import AnimatedUnderlineText from "@/components/desktopComponents/animatedUnderlineText";

const noah = {
  email: "noahammon00@gmail.com",
  username: "nclark561",
  id: "cm2f9bxae0000q848tq2er51l",
};

const kale = {
  email: "kaleckh@gmail.com",
  username: "Kale",
  id: "cm2f8fd2m0000xgv4rb750ad1",
};

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { setLoginToggle, myInfo, loggedIn } = useContext<any>(MyContext);
  const { getBaseUrl } = useContext<any>(PostContext);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const mortyUrl =
    "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";

  const handlePress = () => navigation.dispatch(DrawerActions.openDrawer());

  const searchUsers = async () => {
    
    try {
      const result = await fetch(
        `${getBaseUrl()}users/userSearch?search=${searchInput}`,
      );
      const users = await result.json();      
      setSearchResults(users.user);
    } catch (err) {
      console.log("oops");
    }
  };

  useEffect(() => {
    if (searchInput.length > 0) searchUsers();
  }, [searchInput]);

  const profileImageUri = useMemo(() => {
    if (myInfo?.id) {
      return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo.id}?${Date.now()}`;
    }
    return mortyUrl; // Fallback URL
  }, [myInfo?.id]);

  const blurhash = myInfo?.blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe";

  return (
    <ThemedView style={styles.pageContainer}>
      <ThemedView style={styles.desktopCenter}>
        <ThemedView style={styles.desktopRow}>
          <ThemedView style={styles.mainContent}>
            <ThemedView style={styles.header}>
              {loggedIn ? (
                <Pressable onPress={handlePress}>
                  <Image
                    style={styles.profilePic}
                    source={{ uri: profileImageUri }}
                    placeholder={{ blurhash }}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={() => router.navigate("/login")}>
                  <AnimatedUnderlineText style={{ marginLeft: 5 }}>Login</AnimatedUnderlineText>
                </Pressable>
              )}
              <ThemedView
                style={[
                  styles.searchInput,
                  colorScheme === "dark"
                    ? { backgroundColor: "#3b3b3b" }
                    : { backgroundColor: "#d3d3d3" },
                ]}
              >
                <Ionicons
                  size={17}
                  name="search"
                  color={"gray"}
                  style={styles.searchIcon}
                />
                <TextInput
                  placeholder="Search"
                  autoCapitalize="none"
                  placeholderTextColor={"gray"}
                  style={[
                    { maxWidth: "100%" },
                    colorScheme === "dark" && { color: "white" },
                  ]}
                  onChangeText={(text) => setSearchInput(text)}
                />
              </ThemedView>
              <ThemedView style={{ width: 35 }}></ThemedView>
            </ThemedView>

            {searchInput.length === 0 ? (
              <>
                <ThemedText style={styles.title} type="title">
                  Featured
                </ThemedText>
                <ProfileDisplay user={noah} />
                <ProfileDisplay user={kale} />
              </>
            ) : (
              <>
                <ThemedText style={styles.title} type="title">
                  Results
                </ThemedText>
                <Animated.ScrollView>
                  {searchResults?.length > 0 ? (
                    searchResults.map((e: any) => (
                      <ProfileDisplay key={e.id} user={e} />
                    ))
                  ) : (
                    <ThemedText style={styles.center}>
                      No results found
                    </ThemedText>
                  )}
                </Animated.ScrollView>
              </>
            )}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  pageContainer: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
  },
  desktopCenter: {
    width: width > 600 ? "80%" : "100%",
  },
  desktopRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  mainContent: {
    width: width > 600 ? "100%" : "100%",
  },
  header: {
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 0.5,
    borderColor: "rgb(232,232,232)",
  },
  profilePic: {
    borderRadius: 15,
    width: 35,
    height: 35,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    borderRadius: 25,
    padding: 10,
    width: "70%",
  },
  searchIcon: {
    marginHorizontal: 3,
  },
  title: {
    margin: 10,
  },
  center: {
    marginLeft: 12,
  },
  desktopHiddenBorder: {
    display: width > 600 ? "flex" : "none",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "rgb(232,232,232)",
    borderRadius: 10,
    padding: 15,
  },
  sectionHeader: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 20,
    marginBottom: 10,
  },
});
