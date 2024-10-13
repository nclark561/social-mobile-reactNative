import { useState, useRef } from "react";
import { ThemedText } from "../ThemedText";
import { StyleSheet, Animated, useColorScheme } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { ThemedView } from "../ThemedView";

const AnimatedUnderlineText = ({ ...rest }: any) => {
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const hover = Gesture.Hover()
    .onStart(() => {
      Animated.timing(underlineWidth, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false, // For better performance
      }).start();
    })
    .onEnd(() => {
      Animated.timing(underlineWidth, {
        toValue: 0, // Animate back to no width
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

  return (
    <GestureDetector gesture={hover}>
      <ThemedView style={{ flexDirection: "column", position: "relative" }}>
        <ThemedText {...rest} />
        <Animated.View
          style={[
            styles.underline,
            {
              width: underlineWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
            colorScheme === "dark"
              ? { backgroundColor: "white" }
              : { backgroundColor: "black" },
          ]}
        />
      </ThemedView>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  underline: {
    height: 2,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});

export default AnimatedUnderlineText;
