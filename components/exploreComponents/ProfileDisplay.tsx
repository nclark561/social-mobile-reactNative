import { StyleSheet, Pressable } from "react-native";
import { useCallback, useMemo } from "react";
import { router, useFocusEffect } from "expo-router";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useColorScheme } from "react-native";
import { useState, useEffect, useContext } from "react";
import MyContext from "../providers/MyContext";
import { Image } from "expo-image";

interface user {
  email: string;
  username: string;
  id?: string;
  blurhash?: string;
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
      return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${user.id}?${Date.now()}`;
    }
    return mortyUrl; // Fallback URL
  }, [user?.id]);

  const fadedTextColor = colorScheme === "dark" ? "#525252" : "#bebebe";

  const blurhash = user.blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe";

  return (
    <Pressable
      onPress={() => {
        router.navigate(`/profile/${user.email}`);
      }}
    >
      <ThemedView style={styles.previewContainer}>
        <Image
          style={styles.profilePic}
          source={{ uri: profileImageUri }}
          placeholder={{ blurhash }}
          transition={500}
        />
        <ThemedView style={styles.profileInfo}>
          <ThemedText>{user.username}</ThemedText>
          <ThemedText style={{ color: fadedTextColor }}>
            @{user.email}
          </ThemedText>
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
