import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../constants/Colors';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
