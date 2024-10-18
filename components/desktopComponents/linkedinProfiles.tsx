import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  useColorScheme,
  Dimensions,
  Linking,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useContext, useEffect, useMemo } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { Link, router } from "expo-router";
import MyContext from "../providers/MyContext";
import { Image } from "expo-image";
import ProfileDisplay from "@/components/exploreComponents/ProfileDisplay";
import DesktopSuggestedProfiles from "./desktopSuggestedProfiles";
import Projects from "./projects";

const noah = {
  email: "noahammon00@gmail.com",
  username: "nclark561",
  id: "cm1jrrymy0000boszjdsbtabc",
};

const kale = {
  email: "kaleckh@gmail.com",
  username: "Kale",
  id: "cm2f63lp300001279dlnff4ur",
};

export default function LinkedinProfiles() {
  return (
    <ThemedView>
      <DesktopSuggestedProfiles />
      <ThemedView style={styles.desktopHiddenBorder}>
        <ThemedText style={styles.sectionHeader}>Connect with Us</ThemedText>
        <ThemedView style={styles.profileCard}>
          <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
          <ThemedText style={styles.profileCardText}>
            Connect with Kale on LinkedIn
          </ThemedText>
          <Pressable
            onPress={() =>
              Linking.openURL(
                "https://www.linkedin.com/in/kaleck-hamm-692a54a1/",
              )
            }
            style={[styles.profileButton]}
          >
            <Text style={styles.buttonText}>Profile</Text>
          </Pressable>
        </ThemedView>
        <ThemedView style={styles.profileCard}>
          <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
          <ThemedText style={styles.profileCardText}>
            Connect with Noah on LinkedIn
          </ThemedText>
          <Pressable
            onPress={() =>
              Linking.openURL(
                "https://www.linkedin.com/in/noah-clark-62532426b/",
              )
            }
            style={[styles.profileButton]}
          >
            <Text style={styles.buttonText}>Profile</Text>
          </Pressable>
        </ThemedView>
        <Projects />
      </ThemedView>
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
  sectionHeader: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 20,
    marginBottom: 10,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileCardText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  profileButton: {
    backgroundColor: "rgb(38,102,193)", // LinkedIn Blue
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },
});
