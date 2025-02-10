import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { useChat } from '../../hooks/useChat';
import { Message } from '../../types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Character } from '../../services/ai';
import { useState, useCallback } from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

export default function ChatScreen() {
  const router = useRouter();
  const { nickname = '', character = 'etienne' } = 
    useLocalSearchParams<{ nickname: string, character: Character }>();
  
  const [currentCharacter, setCurrentCharacter] = useState<Character>(character);
  
  const { messages, loading, sendMessage } = useChat('test-chat-id', nickname, currentCharacter);

  const handleCharacterSwitch = useCallback((direction: 'left' | 'right') => {
    console.log('Switching character:', direction);
    setCurrentCharacter(prev => {
      const next = direction === 'right' ? 'etienne' : 'oliver';
      console.log('New character:', next);
      return next;
    });
  }, []);

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((event) => {
      if (event.translationX > 50) {
        handleCharacterSwitch('right');
      } else if (event.translationX < -50) {
        handleCharacterSwitch('left');
      }
    });

  console.log('Current character:', currentCharacter);

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
          <Text style={styles.characterName}>
            {currentCharacter === 'etienne' ? 'Etienne' : 'Oliver'}
          </Text>
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
    alignItems: 'center',
  },
  characterName: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  chatContainer: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
  },
});