import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaView, StyleSheet, Dimensions } from "react-native";
import { Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MyProvider } from "../components/providers/MyContext";
import { PostProvider } from "../components/providers/PostContext";
import { ThemedView } from "@/components/ThemedView";
import { MessageProvider } from "@/components/providers/MessageContext";
import DesktopRouting from "@/components/desktopComponents/desktopRouting";
import StackLogos from "@/components/desktopComponents/stackLogos";
import DesktopSuggestedProfiles from "@/components/desktopComponents/desktopSuggestedProfiles";
import Projects from "@/components/desktopComponents/projects";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <MyProvider>
            <MessageProvider>
              <PostProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor }}>
                  <ThemedView style={styles.row}>
                    <ThemedView style={styles.content}>
                      <ThemedView style={styles.column}>
                        <DesktopRouting />
                        <StackLogos />
                      </ThemedView>
                      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
                        <Stack.Screen name="(drawer)" />
                      </Stack>
                      <ThemedView style={styles.column}>
                        <DesktopSuggestedProfiles />
                        <Projects />
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                </SafeAreaView>
              </PostProvider>
            </MessageProvider>
          </MyProvider>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%'
  }
});
