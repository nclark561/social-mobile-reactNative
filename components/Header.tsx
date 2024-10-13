import {
  View,
  StyleSheet,
  Pressable,
  useColorScheme,
  Text,
} from "react-native";
import { useState, useContext, useMemo } from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import MyContext from "./providers/MyContext";
import { Image } from "expo-image";
import { router } from "expo-router";
import { supabase } from "./Supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  const colorScheme = useColorScheme();

  const context = useContext<any>(MyContext);
  const { myInfo, loggedIn, setLoginToggle, setLoggedIn, getUser } = context;

  const [showLogout, setShowLogout] = useState(false); // State to toggle popup visibility

  const mortyUrl =
    "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";

  const profileImageUri = useMemo(() => {
    if (myInfo?.id) {
      return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo?.id}?${Date.now()}`;
    }
    return mortyUrl; // Fallback URL
  }, [myInfo?.id]);

  const blurhash = myInfo?.blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe";

  // Toggle the logout modal
  

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      await AsyncStorage.removeItem("user");
      if (error) {
        console.log("this is logout error", error);
      }
      await getUser();
      router.navigate("/login");
      setLoginToggle(false);
      setLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemedView style={styles.page}>
      {loggedIn ? (
        <>
          
            <Image
              style={styles.profilePic}
              source={{
                uri: profileImageUri,
              }}
              placeholder={{ blurhash }}
            />
          

          {/* Conditional rendering for logout popup */}
          {showLogout && (
            <View style={styles.logoutPopup}>
              <Pressable
                onPress={() => {
                  // Add your logout logic here
                  setLoginToggle(false);
                  
                  router.replace("/login");
                }}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </Pressable>
            </View>
          )}
        </>
      ) : (
        <Pressable
          onPress={() => {
            router.navigate("/login");
          }}
        >
          <ThemedText style={{ marginLeft: 5 }}>Login</ThemedText>
        </Pressable>
      )}

      <ThemedText style={styles.Title}>{name}</ThemedText>
      <ThemedView style={{ width: 35 }}></ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    display: "flex",
    flexDirection: "row",
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
  Title: {
    fontSize: 25,
  },
  logoutPopup: {
    position: "absolute",
    top: 18, // Set just below the profile image (35px height + some margin)
    right: 550,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    zIndex: 100, // Ensures the popup appears above other content
    elevation: 5, // For Android shadow
  },
  logoutText: {
    fontSize: 16,
    color: "#ff0000",
  },
});
