import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { Message } from '../../types';

interface ChatBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export function ChatBubble({ message, isOwnMessage }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.userContainer : styles.assistantContainer
    ]}>
      <Text style={[
        styles.text,
        isOwnMessage ? styles.userText : styles.assistantText
      ]}>
        {message.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    marginVertical: 4,
  },
  userContainer: {
    backgroundColor: '#4B5EAA',  // Dark blue color from the image
    alignSelf: 'flex-end',
    marginLeft: 50,
  },
  assistantContainer: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    marginRight: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#2C2C2C',
  },
}); 