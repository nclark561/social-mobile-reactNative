import { useState, useRef } from "react";
import { ThemedText } from "../ThemedText";
import { Pressable, StyleSheet, Animated } from "react-native";

const AnimatedUnderlineText = ({ ...rest }: any) => {
  const underlineWidth = useRef(new Animated.Value(0)).current;

  const handleHoverIn = () => {
    Animated.timing(underlineWidth, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false, // For better performance
      }).start();
  }

  const handleHoverOut = () => {
    Animated.timing(underlineWidth, {
      toValue: 0, // Animate back to no width
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Pressable
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={{flexDirection: 'column', position: 'relative'}}
    >
      <ThemedText
        {...rest}
      />
      <Animated.View style={[styles.underline, { width: underlineWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}/>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  underline: {
    height: 2,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});

export default AnimatedUnderlineText;
