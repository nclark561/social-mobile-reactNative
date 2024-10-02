import React from "react";
import { Image, StyleSheet } from "react-native";

interface ProfileImageProps {
  profileUri?: string;
}

const ProfileImage = React.memo(({ profileUri }: ProfileImageProps) => {
  return (
    <Image
      style={styles.profilePic}
      source={{ uri: profileUri }} 
    />
  );
});

const styles = StyleSheet.create({
  profilePic: {
    borderRadius: 25,
    width: 25,
    height: 25,
    marginTop: 20,
    marginLeft: 10,
  },
});

export default ProfileImage;
