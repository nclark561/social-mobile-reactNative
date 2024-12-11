// components/MyCustomDrawer.js
import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Button,
  View,
  Pressable,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { ThemedText } from "./ThemedText";
import { supabase } from "./Supabase";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyContext from "./providers/MyContext";
import { ThemedView } from "./ThemedView";


export default function MyCustomDrawer(props: any) {
  const { setLoginToggle, myInfo, loggedIn, getUser, setLoggedIn } =
    useContext<any>(MyContext);
  const colorScheme = useColorScheme();

  // const router = useRouter();
  const mortyUrl =
    "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";

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
      console.log(error, 'testing error');
    }
  };

  const profileImageUri = useMemo(() => {
    if (myInfo?.id) {
      return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo?.id}?${Date.now()}`;
    }
    return mortyUrl; // Fallback URL
  }, [myInfo?.id]);

  const blurhash = myInfo?.blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe";
  

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <ThemedView style={styles.header}>
          {loggedIn ? (
            <Image
              style={styles.profilePic}
              source={{
                uri: profileImageUri,
              }}
              placeholder={{ blurhash }}

            />
          ) : (
            <Pressable
              onPress={() => {
                router.navigate("/login");
              }}
            >
              <ThemedText>Login</ThemedText>
            </Pressable>
          )}
          {loggedIn && (
            <ThemedText style={styles.headerText}>
              {myInfo?.username}
            </ThemedText>
          )}
        </ThemedView>
        <DrawerItemList
          {...props}
          style={colorScheme === "dark" && { color: "white" }}
        />
        <ThemedView style={styles.footer}>
          {loggedIn ? (
            <Button title="Logout" onPress={() => handleLogout()} />
          ) : (
            <></>
          )}
        </ThemedView>
      </ThemedView>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "baseline",
    height: "18%",
    padding: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  profilePic: {
    borderRadius: 15,
    width: 35,
    height: 35,
  },
  footer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
