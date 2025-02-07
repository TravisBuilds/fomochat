import { StyleSheet, View } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import { useState } from 'react';
import { Colors } from '../../constants/Colors';

interface ChatInputProps {
  onSend: (message: string) => void;
  loading?: boolean;
}

export function ChatInput({ onSend, loading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !loading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        value={message}
        onChangeText={setMessage}
        placeholder="Reply or say help..."
        style={styles.input}
        multiline
        maxLength={1000}
        disabled={loading}
        outlineStyle={styles.inputOutline}
        right={
          <TextInput.Icon
            icon="send"
            color={Colors.primary}
            disabled={!message.trim() || loading}
            onPress={handleSend}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 24,
    borderWidth: 0,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}); 