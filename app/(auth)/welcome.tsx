import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/fomo-mascot.png')}
          style={styles.mascot}
        />
        <Text style={styles.title}>
          Hey! I'm <Text style={styles.highlight}>Fomo</Text>
        </Text>
        <Text style={styles.subtitle}>
          Practice your language abilities by chatting with me about Highstreet
        </Text>
      </View>
      <View style={styles.footer}>
        <Button 
          mode="contained"
          onPress={() => router.push('/(auth)/nickname')}
          style={styles.button}
          contentStyle={styles.buttonContent}
          icon="chevron-down"
        >
          Get Started
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  highlight: {
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '80%',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: 'auto',
    minWidth: 150,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5B041',
    paddingHorizontal: 24,
  },
  buttonContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 