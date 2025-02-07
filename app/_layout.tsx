import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { Colors } from '../constants/Colors';

export default function Layout() {
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/welcome" />
        <Stack.Screen name="(auth)/nickname" />
        <Stack.Screen name="(chat)/chat" />
      </Stack>
    </PaperProvider>
  );
}
