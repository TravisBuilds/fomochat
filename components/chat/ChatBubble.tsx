import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Message } from '../../types';

type Props = {
  message: Message;
  isOwnMessage: boolean;
};

export function ChatBubble({ message, isOwnMessage }: Props) {
  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      <Text style={[
        styles.text,
        isOwnMessage ? styles.ownMessageText : styles.otherMessageText
      ]}>
        {message.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary,
  },
  text: {
    fontSize: 16,
  },
  ownMessageText: {
    color: Colors.white,
  },
  otherMessageText: {
    color: Colors.secondaryText,
  },
}); 