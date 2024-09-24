import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Colors } from '@/constants/Colors';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import MyCustomDrawer from '@/components/MyCustomDrawer';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MyProvider } from '../components/providers/MyContext';
import { PostProvider } from '../components/providers/PostContext';
import { MessageProvider } from '@/components/providers/MessageContext';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const backgroundColor = useThemeColor({}, 'background')

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
          <MessageProvider>
            <PostProvider>
              <MyProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor }}>
                  <Drawer drawerContent={(props) => <MyCustomDrawer {...props} />}>
                    <Drawer.Screen
                      name="(tabs)"
                      options={{
                        drawerLabel: 'Home',
                        headerShown: false,
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
                    <Drawer.Screen
                      name="conversation/[conversation]"
                      options={{
                        drawerLabel: () => null, // Hides it from the drawer
                        drawerItemStyle: { display: 'none' }, // Prevents it from appearing in the drawer
                        headerShown: false
                      }}
                    />
                    <Drawer.Screen
                      name="index"
                      options={{
                        drawerLabel: () => null, // Hide index route
                        drawerItemStyle: { display: 'none' }, // Prevents index route from appearing in the drawer
                        headerShown: false
                      }}
                    />
                    <Drawer.Screen
                      name="post/[post]"
                      options={{
                        drawerLabel: () => null, // Hide index route
                        drawerItemStyle: { display: 'none' }, // Prevents index route from appearing in the drawer
                        headerShown: false
                      }}
                    />
                    <Drawer.Screen
                      name="profile/[profile]"
                      options={{
                        drawerLabel: () => null, // Hide index route
                        drawerItemStyle: { display: 'none' }, // Prevents index route from appearing in the drawer
                        headerShown: false
                      }}
                    />
                    <Drawer.Screen
                      name="comment/[comment]"
                      options={{
                        drawerLabel: () => null, // Hide index route
                        drawerItemStyle: { display: 'none' }, // Prevents index route from appearing in the drawer
                        headerShown: false
                      }}
                    />
                    <Drawer.Screen
                      name="MessageComponents/[chatId]"
                      options={{
                        drawerLabel: () => null, // Hide index route
                        drawerItemStyle: { display: 'none' }, // Prevents index route from appearing in the drawer
                        headerShown: false
                      }}
                    />
                    <Drawer.Screen
                      name="MessageComponents/newChat"
                      options={{
                        drawerLabel: () => null, // Hide index route
                        drawerItemStyle: { display: 'none' }, // Prevents index route from appearing in the drawer
                        headerShown: false
                      }}
                    />
                    <Drawer.Screen
                      name="MessageComponents/Test"
                      options={{
                        drawerLabel: () => null, // Hide index route
                        drawerItemStyle: { display: 'none' }, // Prevents index route from appearing in the drawer
                        headerShown: false
                      }}
                    />
                  </Drawer>
                </SafeAreaView>
              </MyProvider>
            </PostProvider>
          </MessageProvider>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
