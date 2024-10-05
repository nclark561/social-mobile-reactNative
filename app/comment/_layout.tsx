// app/Profile/_layout.tsx
import { Stack } from "expo-router";

export default function CommentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name='[comment]'
      />
    </Stack>
  );
}
