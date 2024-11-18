import { StyleSheet, useColorScheme, Dimensions, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedView } from ".././ThemedView";
import { Link } from "expo-router";
import AnimatedUnderlineText from "./animatedUnderlineText";
import MyContext from "../providers/MyContext";
import { useContext, useEffect } from "react";
import { supabase } from "../Supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StackLogos from "@/components/desktopComponents/stackLogos";

export default function DesktopRouting() {
  const colorScheme = useColorScheme();
  const context = useContext<any>(MyContext);
  const { myInfo, loggedIn, setLoginToggle, setLoggedIn, setMyInfo } = context;

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (Platform.OS === "web") {
        localStorage.removeItem("user");
      } else {
        await AsyncStorage.removeItem("user");
      }
      if (error) {
        console.log("this is logout error", error);
      }
      setMyInfo(null);
      setLoginToggle(false);
      setLoggedIn(false);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user =
          Platform.OS === "web"
            ? localStorage.getItem("user")
            : await AsyncStorage.getItem("user");
        console.log(user, "user");
        if (user) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.log("Error reading user from AsyncStorage", error);
      }
    };
    checkUser();
  }, [myInfo]);


  return (
    <ThemedView style={styles.desktopHidden}>
      <ThemedView style={styles.iconRow}>
        <Link href={"/(drawer)/(tabs)/"}>
          <Ionicons
            size={20}
            style={{ padding: 10 }}
            name="home-outline"
            color={colorScheme === "dark" ? "white" : "black"}
          ></Ionicons>
          <AnimatedUnderlineText style={styles.iconSelection}>
            Home
          </AnimatedUnderlineText>
        </Link>
      </ThemedView>
      <ThemedView style={styles.iconRow}>
        <Link href={"/(drawer)/(tabs)/profile"}>
          <Ionicons
            size={20}
            style={{ padding: 10 }}
            name="person-outline"
            color={colorScheme === "dark" ? "white" : "black"}
          ></Ionicons>
          <AnimatedUnderlineText style={styles.iconSelection}>
            Profile
          </AnimatedUnderlineText>
        </Link>
      </ThemedView>
      <ThemedView style={styles.iconRow}>
        <Link href={"/(drawer)/(tabs)/messages"}>
          <Ionicons
            size={20}
            style={{ padding: 10 }}
            name="mail-outline"
            color={colorScheme === "dark" ? "white" : "black"}
          ></Ionicons>
          <AnimatedUnderlineText style={styles.iconSelection}>
            Messages
          </AnimatedUnderlineText>
        </Link>
      </ThemedView>
      <ThemedView style={styles.iconRow}>
        <Link href={"/(tabs)/explore"}>
          <Ionicons
            size={20}
            style={{ padding: 10 }}
            name="search-outline"
            color={colorScheme === "dark" ? "white" : "black"}
          ></Ionicons>
          <AnimatedUnderlineText style={styles.iconSelection}>
            Search
          </AnimatedUnderlineText>
        </Link>
      </ThemedView>
      <ThemedView style={styles.iconRow}>
        {loggedIn ? (
          <Link onPress={handleLogout} href={"/(drawer)/login"}>
            <Ionicons
              size={20}
              style={{ padding: 10 }}
              name="log-in-outline"
              color={colorScheme === "dark" ? "white" : "black"}
            ></Ionicons>
            <AnimatedUnderlineText style={styles.iconSelection}>
              Logout
            </AnimatedUnderlineText>
          </Link>
        ) : (
          <Link href={"/(drawer)/login"}>
            <Ionicons
              size={20}
              style={{ padding: 10 }}
              name="log-in-outline"
              color={colorScheme === "dark" ? "white" : "black"}
            ></Ionicons>
            <AnimatedUnderlineText style={styles.iconSelection}>
              Login
            </AnimatedUnderlineText>
          </Link>
        )}
      </ThemedView>
      <StackLogos />
    </ThemedView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  desktopHidden: {
    display: width > 600 ? "flex" : "none",
    height: 900,
    justifyContent: "space-evenly",
  },
  desktopHiddenFullscreen: {
    display: width > 600 ? "flex" : "none",
  },
  desktopHiddenBorder: {
    display: width > 600 ? "flex" : "none",
    height: "50%",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "rgb(232,232,232)",
    borderRadius: 10,
    padding: 15,
  },
  iconRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  iconSelection: {
    fontSize: 20,
  },
});
