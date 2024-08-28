import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import MyCustomDrawer from '@/components/MyCustomDrawer'; // Import your custom drawer

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

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
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <SafeAreaView style={{ flex: 1 }}>
            <Drawer drawerContent={(props) => <MyCustomDrawer {...props} />}>
              <Drawer.Screen
                name="(tabs)"
                options={{
                  drawerLabel: 'Home',
                  title: 'Posts',
                }}
              />
              <Drawer.Screen
                name="settings"
                options={{
                  drawerLabel: 'Settings',
                  title: 'Settings',
                }}
              />
                <Drawer.Screen
                name="login"
                options={{
                  drawerLabel: 'Login',
                  title: 'Login',
                }}
              />
            </Drawer>
          </SafeAreaView>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
