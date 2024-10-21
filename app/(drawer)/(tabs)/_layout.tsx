import { SafeAreaView, Platform, useWindowDimensions } from "react-native";
import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import MyContext from "@/components/providers/MyContext";
import { useContext } from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");

  const context = useContext<any>(MyContext);
  const { loggedIn } = context;

  // Automatically tracks window dimension changes
  const { width, height } = useWindowDimensions();

  // Debugging purposes: See if the dimensions change
  console.log('Window dimensions:', width, height);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarStyle: {
            backgroundColor,
            borderTopWidth: 1,
            display: Platform.OS === "web" && width > 1000 ? "none" : "flex",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
                size={20}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "search" : "search-outline"}
                color={color}
                size={20}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "mail" : "mail-outline"}
                color={color}
                size={20}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "person" : "person-outline"}
                color={color}
                size={20}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
