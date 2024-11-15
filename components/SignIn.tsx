import {
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { ThemedView } from "./ThemedView";
import { supabase } from "./Supabase";
import { Link, router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import MyContext from "./providers/MyContext";
import PostContext from "./providers/PostContext";
import { Platform } from "react-native";
import { ThemedText } from "./ThemedText";

export default function SignIn({
  setLogin,
}: {
  setLogin: (value: boolean) => void;
}) {
  const [email, setEmail] = useState<string>(""); // Initialize with an empty string
  const [password, setPassword] = useState<string>(""); // Initialize with an empty string
  const colorScheme = useColorScheme();
  const context = useContext<any>(MyContext);
  const { setLoginToggle, getUser, setLoggedIn } = context;
  const { setForYouPosts } = useContext<any>(PostContext);
  const [error, setError] = useState<any>();

  const color = colorScheme === "dark" ? "white" : "black";

  const handleLogin = async (email: string, password: string) => {
    debugger
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.log(error, "this is the login error");
        setError(error.message);
        throw new Error("login error");
      }
      if (data) {
        console.log(data, "this is the login data");
        if (Platform.OS === "web") {
          await localStorage.setItem("user", JSON.stringify(email));
        } else {
          await AsyncStorage.setItem("user", JSON.stringify(email));
        }

        setLogin(true);
        setLoginToggle(true);
        setForYouPosts([]);
        await getUser();
        if (Platform.OS === "web") {
          location.reload();
        } else {
          router.navigate("/(drawer)/(tabs)/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(() => {
    if (Platform.OS === "web") {
      const user = localStorage.getItem("user");
      if (user) router.navigate("/(drawer)/(tabs)/");
    }
  });

  return (
    <ThemedView style={styles.page}>
      <ThemedView style={styles.wide}>
        <ThemedText style={{ fontSize: 30, padding: 20 }}>Login</ThemedText>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor={"rgb(140, 138, 143)"}
          placeholder="Email"
          autoCapitalize="none"
          style={[styles.loginInput, { color }]}
        />
        <TextInput
          onChangeText={(text) => setPassword(text)}
          placeholderTextColor={"rgb(140, 138, 143)"}
          placeholder="Password"
          autoCapitalize="none"
          style={[styles.loginInput, { color }]}
          secureTextEntry={true} // Ensure password input is secure
        />
        {error && <ThemedText style={styles.error}>{error}</ThemedText>}
      </ThemedView>
      <ThemedView style={styles.wide}>
        <Pressable
          onPress={() => handleLogin(email, password)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
        <Text style={styles.gray}>Or</Text>
        <Pressable
          onPress={() => {
            setLogin(false);
          }}
        >
          <Text style={styles.blueText}>Create Account</Text>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },

  loginInput: {
    width: "90%",
    borderRadius: 0,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgb(197, 191, 191)",
    padding: 12,
    marginVertical: 10, // Vertical margin between inputs
  },

  gray: {
    color: "gray",
  },

  wide: {
    width: "90%",
    alignItems: "center", // Centers content within this View
    marginBottom: 20, // Adds space between the input group and buttons
  },

  button: {
    backgroundColor: "rgb(63, 134, 196)",
    borderRadius: 5,
    padding: 10,
    width: "90%",
    alignItems: "center", // Centers the text within the button
    marginVertical: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
  },

  blueText: {
    color: " rgb(63, 134, 196)",
    paddingTop: 5,
  },
  error: {
    color: "red",
  },
});
