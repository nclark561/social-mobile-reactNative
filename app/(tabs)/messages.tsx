import { StyleSheet, Button } from "react-native";
import CustomBottomSheet from "@/components/util/CustomBottomSheet";
import { ThemedView } from "@/components/ThemedView";
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useRef } from "react";
import { ThemedText } from "@/components/ThemedText";


export default function messages() {
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const handleOpenPress = () => bottomSheetRef.current?.present()

  return (
    <ThemedView style={styles.container}>
      <Button title="open" onPress={handleOpenPress}></Button>
      <CustomBottomSheet title="Share" ref={bottomSheetRef}>
        <ThemedText style={styles.text}>Hello</ThemedText>
      </CustomBottomSheet>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: "light-grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  indicator: {
    backgroundColor: '#bebebe',
    width: '20%'
  },
  text: {
    textAlign: 'center'
  }
});
