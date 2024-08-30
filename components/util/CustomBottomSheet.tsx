import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { StyleSheet, Pressable } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMemo, useCallback, forwardRef, ReactNode } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CustomBottomSheetProps {
  children: ReactNode,
  title?: string,
  snapPercs: string[],
  hideCancelButton?: boolean
}
type Ref = BottomSheetModal

const CustomBottomSheet = forwardRef<Ref, CustomBottomSheetProps>(({children, title, snapPercs, hideCancelButton}, ref) => {
  const snapPoints = useMemo(() => snapPercs, []);
  const backgroundColor = useThemeColor({}, 'background')

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props}></BottomSheetBackdrop>,
    []
  )

  //@ts-ignore
  const handleClosePress = () => ref?.current?.dismiss()

  return (
    <BottomSheetModal
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        ref={ref}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={{ backgroundColor }}
    >
      <ThemedView style={styles.container}>
        {title && <ThemedText type="title" style={styles.header}>{title}</ThemedText>}
        {children}
        {!hideCancelButton && <Pressable onPress={handleClosePress} style={styles.button}>
          <ThemedText>Cancel</ThemedText>
        </Pressable>}
      </ThemedView>
    </BottomSheetModal>
  )
})

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: '#bebebe',
    width: 75,
  },
  button: {
    padding: 3,
    borderColor: 'black',
    borderRadius: 25,
    textAlign: 'center',
    alignItems: 'center',
    borderWidth: .5,
    width: 250,
  },
  container: {
    flexDirection: "column",
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    paddingBottom: 60
  },
  header: {
    textAlign: 'center',
  },
})

export default CustomBottomSheet