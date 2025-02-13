import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import type { Character } from '../../services/ai';

export default function NicknameScreen() {
  const [nickname, setNickname] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>('etienne');

  const handleContinue = () => {
    if (nickname.trim()) {
      router.push({
        pathname: '/(chat)/chat',
        params: { 
          nickname: nickname.trim(),
          character: selectedCharacter
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Bartender</Text>
      
      <View style={styles.characterSelection}>
        <TouchableOpacity 
          style={[
            styles.characterButton,
            selectedCharacter === 'etienne' && styles.selectedCharacter
          ]}
          onPress={() => setSelectedCharacter('etienne')}
        >
          <Text style={styles.characterName}>Étienne</Text>
          <Text style={styles.characterDesc}>Champagne Specialist</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.characterButton,
            selectedCharacter === 'oliver' && styles.selectedCharacter
          ]}
          onPress={() => setSelectedCharacter('oliver')}
        >
          <Text style={styles.characterName}>Oliver</Text>
          <Text style={styles.characterDesc}>Master Mixologist</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your nickname"
        value={nickname}
        onChangeText={setNickname}
        placeholderTextColor="#666"
      />

      <TouchableOpacity 
        style={[styles.button, !nickname.trim() && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!nickname.trim()}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  characterSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  characterButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    width: '45%',
  },
  selectedCharacter: {
    backgroundColor: Colors.primary,
  },
  characterName: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: 'bold',
  },
  characterDesc: {
    fontSize: 14,
    color: Colors.text,
    opacity: 0.8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 