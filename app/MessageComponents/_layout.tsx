// app/Profile/_layout.tsx
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name='[chatId]'
      />
      <Stack.Screen
        name='newChat'
      />
    </Stack>
  );
}
