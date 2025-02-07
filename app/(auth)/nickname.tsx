import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors } from '../../constants/Colors';
import { supabase } from '../../services/supabase';

export default function NicknameScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (nickname.trim()) {
      setIsLoading(true);
      try {
        // Insert nickname into Supabase
        const { error } = await supabase
          .from('nicknames')
          .insert([{ nickname: nickname.trim() }]);

        if (error) {
          console.error('Error saving nickname:', error);
          return;
        }

        // Pass nickname to chat screen
        router.push({
          pathname: '/(chat)/chat',
          params: { nickname: nickname.trim() }
        });
      } catch (err) {
        console.error('Failed to save nickname:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Enter your nickname"
        value={nickname}
        onChangeText={setNickname}
        style={styles.input}
        mode="outlined"
      />
      <Button 
        mode="contained" 
        onPress={handleContinue}
        style={styles.button}
        disabled={!nickname.trim() || isLoading}
        loading={isLoading}
      >
        Continue
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
}); 