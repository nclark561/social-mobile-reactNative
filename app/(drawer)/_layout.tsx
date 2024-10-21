import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaView, Dimensions } from "react-native";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import MyCustomDrawer from "@/components/MyCustomDrawer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MyProvider } from "../../components/providers/MyContext";
import { PostProvider } from "../../components/providers/PostContext";
import { MessageProvider } from "@/components/providers/MessageContext";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");

  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);

  // UseEffect to monitor window size changes and update state
  useEffect(() => {
    const handleResize = () => {
      const { width } = Dimensions.get("window");
      setWindowWidth(width);
    };

    const subscription = Dimensions.addEventListener("change", handleResize);

    return () => {
      subscription?.remove();
    };
  }, []);

  // Define whether we are in desktop view or mobile/tablet view
  const isDesktop = windowWidth >= 1024;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <MyProvider>
            <MessageProvider>
              <PostProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor }}>
                  {isDesktop ? (
                    // Stack Navigator on desktop
                    <Stack>
                      <Stack.Screen
                        name="(tabs)"
                        options={{
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="settings"
                        options={{
                          title: "Settings",
                        }}
                      />
                      <Stack.Screen
                        name="login"
                        options={{
                          headerShown: false,
                          title: "Login",
                        }}
                      />
                      <Stack.Screen
                        name="conversation"
                        options={{
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="index"
                        options={{
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="post"
                        options={{
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="profile"
                        options={{
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="comment"
                        options={{
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="MessageComponents"
                        options={{
                          headerShown: false,
                        }}
                      />
                    </Stack>
                  ) : (
                    // Drawer Navigator on mobile/tablet
                    <Drawer
                      drawerContent={(props) => <MyCustomDrawer {...props} />}
                    >
                      <Drawer.Screen
                        name="(tabs)"
                        options={{
                          drawerLabel: "Home",
                          headerShown: false,
                        }}
                      />
                      <Drawer.Screen
                        name="settings"
                        options={{
                          drawerLabel: "Settings",
                          title: "Settings",
                        }}
                      />
                      <Drawer.Screen
                        name="login"
                        options={{
                          drawerLabel: "Login",
                          title: "Login",
                        }}
                      />
                      <Drawer.Screen
                        name="conversation"
                        options={{
                          drawerLabel: () => null,
                          drawerItemStyle: { display: "none" },
                          headerShown: false,
                        }}
                      />
                      <Drawer.Screen
                        name="index"
                        options={{
                          drawerLabel: () => null,
                          drawerItemStyle: { display: "none" },
                          headerShown: false,
                        }}
                      />
                      <Drawer.Screen
                        name="post"
                        options={{
                          drawerLabel: () => null,
                          drawerItemStyle: { display: "none" },
                          headerShown: false,
                        }}
                      />
                      <Drawer.Screen
                        name="profile"
                        options={{
                          drawerLabel: () => null,
                          drawerItemStyle: { display: "none" },
                          headerShown: false,
                        }}
                      />
                      <Drawer.Screen
                        name="comment"
                        options={{
                          drawerLabel: () => null,
                          drawerItemStyle: { display: "none" },
                          headerShown: false,
                        }}
                      />
                      <Drawer.Screen
                        name="MessageComponents"
                        options={{
                          drawerLabel: () => null,
                          drawerItemStyle: { display: "none" },
                          headerShown: false,
                        }}
                      />
                    </Drawer>
                  )}
                </SafeAreaView>
              </PostProvider>
            </MessageProvider>
          </MyProvider>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
