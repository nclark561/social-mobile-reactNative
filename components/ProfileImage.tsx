import React from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";

interface ProfileImageProps {
  profileUri?: string;
  blurhash?: string;
}

const ProfileImage = React.memo(
  ({ profileUri, blurhash }: ProfileImageProps) => {
    return (
      <Image
        style={styles.profilePic}
        source={{ uri: profileUri }}
        placeholder={{ blurhash }}
        transition={1000}
      />
    );
  },
);

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
