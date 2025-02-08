import { View, StyleSheet, FlatList, SafeAreaView, GestureResponderEvent } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { useChat } from '../../hooks/useChat';
import { Message } from '../../types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Character } from '../../services/ai';
import { useState } from 'react';
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';

export default function ChatScreen() {
  const router = useRouter();
  const { nickname = '', character: initialCharacter = 'etienne' } = 
    useLocalSearchParams<{ nickname: string, character: Character }>();
  
  const [currentCharacter, setCurrentCharacter] = useState<Character>(initialCharacter);
  
  const { messages, loading, sendMessage } = useChat('test-chat-id', nickname, currentCharacter);

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX > 50) {  // Swipe right
        setCurrentCharacter('etienne');
      } else if (event.translationX < -50) {  // Swipe left
        setCurrentCharacter('oliver'); 
      }
    });

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble message={item} isOwnMessage={item.user_nickname === nickname} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor={Colors.white}
          size={24}
          onPress={() => router.back()}
        />
        <View style={styles.avatarContainer}>
          {/* Add your Fomo avatar here */}
        </View>
        <View style={styles.headerRight} />
      </View>
      <GestureDetector gesture={swipeGesture}>
        <View style={styles.chatContainer}>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
          />
          <ChatInput onSend={sendMessage} loading={loading} />
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    // Add your Fomo avatar styling
  },
  headerRight: {
    width: 40,  // To balance the header
  },
  chatContainer: {
    flex: 1,
    marginTop: 0, // Remove top margin
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
  },
});