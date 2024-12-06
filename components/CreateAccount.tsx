import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import React, { useContext, useState } from "react";
import { ThemedView } from "./ThemedView";
import { supabase } from "./Supabase";
import PostContext from "./providers/PostContext";
import { ThemedText } from "./ThemedText";

export default function SignIn({
  setLoginToggle,
}: {
  setLoginToggle: (value: boolean) => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [userName, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const colorScheme = useColorScheme();
  const { getUserPosts, posts, getBaseUrl } = useContext<any>(PostContext);
  const [error, setError] = useState<any>();

  const color = colorScheme === "dark" ? "white" : "black";

  const handleSignUp = async (userName: string, email: string) => {
    try {
      const response = await fetch(
        `${getBaseUrl()}users/usernameCheck?username=${userName}`,
      );
      const { user } = await response.json();
      if (user) throw new Error("username already taken");
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        throw new Error(error.message);
      }
      const result = await fetch(`${getBaseUrl()}users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          email: email,
        }),
      });
      setLoginToggle(true);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <ThemedView style={styles.page}>
      <ThemedView style={styles.wide}>
        <ThemedText style={{ fontSize: 30, padding: 20 }}>
          Create Account
        </ThemedText>
        <TextInput
          placeholderTextColor={"rgb(140, 138, 143)"}
          placeholder="Username"
          autoCapitalize="none"
          style={[styles.loginInput, { color }]}
          value={userName}
          onChangeText={setUsername}
        />
        <TextInput
          placeholderTextColor={"rgb(140, 138, 143)"}
          placeholder="Email"
          autoCapitalize="none"
          style={[styles.loginInput, { color }]}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholderTextColor={"rgb(140, 138, 143)"}
          placeholder="Password"
          autoCapitalize="none"
          style={[styles.loginInput, { color }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error && <ThemedText style={styles.error}>{error}</ThemedText>}
      </ThemedView>
      <ThemedView style={styles.wide}>
        <Pressable
          onPress={() => {
            handleSignUp(userName, email);
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>
        <Text style={styles.gray}>Or</Text>
        <Pressable
          onPress={() => {
            setLoginToggle(true);
          }}
        >
          <Text style={styles.blueText}>Login</Text>
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
    marginVertical: 10,
  },
  gray: {
    color: "gray",
  },
  wide: {
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "rgb(63, 134, 196)",
    borderRadius: 5,
    padding: 10,
    width: "90%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  blueText: {
    color: "rgb(63, 134, 196)",
    paddingTop: 5,
  },
  error: {
    color: "red",
  },
});
