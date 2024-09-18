import { StyleSheet, useColorScheme } from 'react-native'
import CustomBottomSheet from '../util/CustomBottomSheet'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { useState, useContext } from 'react'
import MyContext from '../providers/MyContext'

interface EditProfileProps {
    ref: any
}

const EditProfileSheet = ({ ref }: EditProfileProps) => {
  const colorScheme = useColorScheme()
  const { myInfo } =  useContext<any>(MyContext)
  const [bio, setBio] = useState(myInfo?.bio || "");
  const [location, setLocation] = useState(myInfo?.location || "");

  return (
    <CustomBottomSheet hideCancelButton ref={ref} snapPercs={["35%"]}>
        <ThemedView style={styles.bottomSheetContent}>
          <ThemedText style={styles.bottomSheetTitle}>Edit Profile</ThemedText>
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
            placeholder="Location"
            placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#555"}
            value={location}
            onChangeText={setLocation}
          />
          <Button title="Save" onPress={handleSave}></Button>
        </ThemedView>
      </CustomBottomSheet>
  )
}

export default EditProfileSheet

const styles = StyleSheet.create({})