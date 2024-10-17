import { StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import CreateAccount from "@/components/CreateAccount";
import SignIn from "@/components/SignIn";
import { ThemedView } from "@/components/ThemedView";

export default function Login() {
  const [login, setLogin] = useState(true);

  return (
    <ThemedView style={styles.pageContainer}>
      <ThemedView style={styles.desktopCenter}>
        <ThemedView style={styles.desktopRow}>
          <ThemedView style={styles.mainContent}>
            {login ? (
              <SignIn setLogin={setLogin} />
            ) : (
              <CreateAccount setLoginToggle={setLogin} />
            )}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainContent: {
    width: Dimensions.get("window").width > 600 ? "100%" : "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  desktopCenter: {
    width: Dimensions.get("window").width > 600 ? "80%" : "100%",
    marginBottom: 300,
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

  desktopHiddenBorder: {
    display: Dimensions.get("window").width > 600 ? "flex" : "none",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "rgb(232,232,232)",
    borderRadius: 10,
    padding: 15,
  },
});
