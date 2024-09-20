import {
  StyleSheet,
  useColorScheme,
  Button,
  Image,
  TouchableOpacity,
  View
} from "react-native";
import CustomBottomSheet from "../util/CustomBottomSheet";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useState, useContext, SetStateAction } from "react";
import MyContext from "../providers/MyContext";
import * as ImagePicker from "expo-image-picker";

interface EditProfileProps {
  editProfileRef: any;
  currProfileImage: string,
  setProfileImageUri: React.Dispatch<SetStateAction<string>>
}

const EditProfileSheet = ({ editProfileRef, currProfileImage, setProfileImageUri }: EditProfileProps) => {
  const colorScheme = useColorScheme();
  const { myInfo, updateUser } = useContext<any>(MyContext);
  const [bio, setBio] = useState(myInfo?.bio || "");
  const [location, setLocation] = useState(myInfo?.location || "");
  const [links, setLinks] = useState(myInfo?.links || "");
  const [profileImage, setProfileImage] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>("white");
  const mortyUrl = "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg";

  const fadedTextColor = colorScheme === "dark" ? "#525252" : "#bebebe";

  const handleCloseEditProfile = () => editProfileRef?.current?.dismiss();

  const colors = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"]; // 5 color options

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  async function uploadProfileImage(imageUri: string) {
    try {
      // Fetch the image from the URI
      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }      
      const formData = new FormData();

      formData.append("image", {
        uri: imageUri, // The local URI of the image
        type: "image/jpg",
        name: `${myInfo.id}.jpg`,
      } as any);

      // Make the POST request with fetch      
      const uploadResponse = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/supabase-s3`,
        {
          method: "POST",
          body: formData,
        }
      );
      // Check if the upload was successful
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text(); // Get the error text if the response is not ok
        throw new Error(`Upload failed: ${errorText}`);
      }
      // Parse the JSON response from the server
      const result = await uploadResponse.json();
      console.log("Upload successful:", result);
      setProfileImageUri(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo.id}.jpg?${Date.now()}`)
      setProfileImage(null)
    } catch (error) {
      console.error(
        "Error uploading image:",
        error instanceof Error ? error.message : error
      );
    }
  }

  const handleSave = async () => {
    if (profileImage) await uploadProfileImage(profileImage)
    updateUser(myInfo.email, links, location, bio, selectedColor);
    handleCloseEditProfile();
  };


  return (
    <CustomBottomSheet
      hideCancelButton
      ref={editProfileRef}
      snapPercs={["60%"]}
    >
      <ThemedView style={styles.bottomSheetContent}>
        <ThemedText style={styles.bottomSheetTitle}>Edit Profile</ThemedText>
        <View style={styles.colorOptionsContainer}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0 },
              ]}
              onPress={() => handleColorSelect(color)}
            />
          ))}
        </View>
        <ThemedView style={styles.picContainer}>
          <ThemedView style={{ flexDirection: "column", alignItems: "center" }}>
            <Image
              style={styles.profilePic}
              source={{ uri: profileImage || currProfileImage }}
              defaultSource={{ uri: mortyUrl }}
            />
            <TouchableOpacity
              style={[styles.button, { borderColor: fadedTextColor }]}
              onPress={pickImage}
            >
              <ThemedText>Select Profile Picture</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        <BottomSheetTextInput
          style={[
            styles.input,
            { color: colorScheme === "dark" ? "#fff" : "#000" },
          ]}
          placeholder="Bio"
          placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#555"}
          value={bio}
          onChangeText={setBio}
        />
        <BottomSheetTextInput
          style={[
            styles.input,
            { color: colorScheme === "dark" ? "#fff" : "#000" },
          ]}
          placeholder="Links"
          placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#555"}
          value={links}
          onChangeText={setLinks}
        />
        <BottomSheetTextInput
          style={[
            styles.input,
            { color: colorScheme === "dark" ? "#fff" : "#000" },
          ]}
          placeholder="Location"
          placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#555"}
          value={location}
          onChangeText={setLocation}
        />
        <Button title="Save" onPress={handleSave}></Button>
      </ThemedView>
    </CustomBottomSheet>
  );
};

export default EditProfileSheet;

const styles = StyleSheet.create({
  bottomSheetContent: {
    padding: 20,
    width: "90%",
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  profilePic: {
    borderRadius: 100,
    height: 90,
    width: 90,
    marginBottom: 15,
  },
  picContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 20,
  },
  button: {
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  colorOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",    
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "#000",
  },
});
