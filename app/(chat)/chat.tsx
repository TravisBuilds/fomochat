import { View, StyleSheet, FlatList, SafeAreaView, Platform, StatusBar } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { useChat } from '../../hooks/useChat';
import { Message } from '../../types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Character } from '../../services/ai';
import { useState, useCallback, useRef, useEffect } from 'react';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native';

export default function ChatScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const params = useLocalSearchParams<{ nickname: string, character: Character }>();
  const nickname = params.nickname || '';
  const character = params.character || 'etienne';
  
  const [currentCharacter, setCurrentCharacter] = useState<Character>(character);
  
  // Create unique chat ID for each character
  const chatId = `${currentCharacter}_${nickname}`;
  const { messages, loading, sendMessage } = useChat(chatId, nickname, currentCharacter);

  useEffect(() => {
    setCurrentCharacter(character);
  }, [character]);

  const handleCharacterSwitch = useCallback((direction: 'left' | 'right') => {
    console.log('🎯 handleCharacterSwitch called with direction:', direction);
    const newCharacter: Character = direction === 'right' ? 'etienne' : 'oliver';
    console.log('🔄 Switching to:', newCharacter);
    setCurrentCharacter(newCharacter);
    router.setParams({ character: newCharacter });
  }, [router]);

  console.log('Component rendered'); // Debug render

  const scrollToBottom = (animated = true) => {
    setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated });
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble message={item} isOwnMessage={item.user_nickname === nickname} />
  );

  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-20, 20])
    .onBegin(() => {
      console.log('🟡 Touch detected');
    })
    .onStart(() => {
      console.log('🟢 Swipe started');
    })
    .onTouchesDown(() => {
      console.log('👇 Touches down');
    })
    .onEnd((event) => {
      console.log('🔵 Swipe ended');
      console.log('Translation X:', event.translationX);
      
      if (event.translationX > 50) {
        console.log('➡️ Right swipe detected');
        handleCharacterSwitch('right');
      } else if (event.translationX < -50) {
        console.log('⬅️ Left swipe detected');
        handleCharacterSwitch('left');
      }
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header} />
        <GestureDetector gesture={swipeGesture}>
          <View style={[styles.content, { backgroundColor: Colors.background }]}>
            <Text>Current character: {currentCharacter}</Text>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item: Message) => (item.id || Date.now()).toString()}
              contentContainerStyle={styles.messageList}
              onContentSizeChange={() => scrollToBottom()}
              onLayout={() => scrollToBottom(false)}
            />
            <ChatInput onSend={sendMessage} loading={loading} />
          </View>
        </GestureDetector>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    height: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  messageList: {
    padding: 10,
    paddingBottom: 20,
  },
});