import { Tabs, useFocusEffect } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useContext } from "react";
import MyContext from "@/components/providers/MyContext";
import { router } from "expo-router";
import { SafeAreaView, Dimensions, useWindowDimensions, Platform } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");

  const context = useContext<any>(MyContext);
  const { loggedIn } = context;
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={{flex: 1}}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarStyle: {
            backgroundColor,
            borderTopWidth: 1,
            display: Platform.OS === 'web' && width > 1000 ? 'none' : 'flex'
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
