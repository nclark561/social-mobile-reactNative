import { StyleSheet, Image, Pressable } from "react-native";
import { useCallback, useMemo } from "react";
import { router, useFocusEffect } from "expo-router";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useColorScheme } from "react-native";
import { useState, useEffect, useContext } from "react";
import MyContext from "../providers/MyContext";

interface user {
  email: string;
  username: string;
  id?: string;
}

interface ProfileDisplayProps {
  user: user;
}

const ProfileDisplay = ({ user }: ProfileDisplayProps) => {
  const colorScheme = useColorScheme();

  const mortyUrl =
    "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";
  const { myInfo } = useContext<any>(MyContext);






  const profileImageUri = useMemo(() => {
    if (user?.id) {
      return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${user.id}.jpg?${Date.now()}`;
    }
    return mortyUrl; // Fallback URL
  }, [user?.id]);


  const fadedTextColor = colorScheme === "dark" ? "#525252" : "#bebebe";

  return (
    <Pressable onPress={() => {router.navigate(`/profile/${user.email}`)}}>
      <ThemedView style={styles.previewContainer}>
        <Image
          style={styles.profilePic}
          source={{ uri: profileImageUri }}
        />
        <ThemedView style={styles.profileInfo}>
          <ThemedText>{user.username}</ThemedText>
          <ThemedText style={{ color: fadedTextColor }}>@{user.email}</ThemedText>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
};

export default ProfileDisplay;

const styles = StyleSheet.create({
  previewContainer: {
    flexDirection: "row",
    margin: 12,
  },
  profilePic: {
    borderRadius: 25,
    height: 50,
    width: 50,
  },
  profileInfo: {
    flexDirection: "column",
    marginLeft: 10,
  },
});
