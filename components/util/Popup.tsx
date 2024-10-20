import { ThemedView } from "../ThemedView";
import { StyleSheet, Pressable } from "react-native";
import { ReactNode } from "react";

interface PopupProps {
  children: ReactNode;
}

const CustomBottomSheet = ({ children }: PopupProps) => {

  return (
        <ThemedView style={styles.container}>
            <ThemedView>
                <Pressable></Pressable>
            </ThemedView>
            {children}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    paddingBottom: 60,
  },
});

export default CustomBottomSheet;
