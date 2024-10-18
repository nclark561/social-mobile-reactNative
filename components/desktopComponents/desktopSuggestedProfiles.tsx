import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  useColorScheme,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useContext, useEffect, useMemo } from "react";
import { ThemedView } from ".././ThemedView";
import { ThemedText } from ".././ThemedText";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { Link, router } from "expo-router";
import MyContext from ".././providers/MyContext";
import { Image } from "expo-image";
import ProfileDisplay from "@/components/exploreComponents/ProfileDisplay";

const noah = {
  email: "noahammon00@gmail.com",
  username: "Noah",
  id: "cm2axaly20001gays58jtdvde",
};

const kale = {
  email: "kaleckh@gmail.com",
  username: "Kale",
  id: "cm2f8fd2m0000xgv4rb750ad1",
};

export default function DesktopSuggestedProfiles() {
  return (
    <ThemedView style={styles.desktopHiddenBorder}>
      <ThemedText
        style={{ textAlign: "center", fontWeight: "800", fontSize: 20 }}
      >
        Who To Follow
      </ThemedText>
      <ProfileDisplay user={noah} />
      <ProfileDisplay user={kale} />
      {/* <ThemedText>Simulator Demo Video</ThemedText>
        <ThemedText>Hire Us!</ThemedText> */}
    </ThemedView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  desktopHidden: {
    display: width > 600 ? "flex" : "none",
    height: "50%",
    justifyContent: "space-evenly",
  },
  desktopHiddenFullscreen: {
    display: width > 600 ? "flex" : "none",
  },
  desktopHiddenBorder: {
    display: width > 600 ? "flex" : "none",
    height: "35%",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "rgb(232,232,232)",
    borderRadius: 10,
    padding: 15,
    margin: 10,
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
