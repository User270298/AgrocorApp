import React, { useRef } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { AnimatedMessage } from '../../components/AnimatedMessage';
import { useMessages } from '../../hooks/useMessages';
import { theme } from '../../constants/theme';

const URL_BASE = "http://192.168.1.103:8000";

export default function Assistant() {
  const [input, setInput] = React.useState('');
  const flatListRef = useRef(null);
  
  const {
    messages,
    isLoading,
    isOnline,
    sendMessage,
    clearMessages,
  } = useMessages({
    apiUrl: `${URL_BASE}/ask`,
    initialMessage: 'Привет! Чем могу помочь?',
  });

  const handleSend = async () => {
    if (input.trim()) {
      const currentInput = input;
      setInput('');
      await sendMessage(currentInput);
    }
  };

  const renderMessage = ({ item, index }) => (
    <AnimatedMessage
      sender={item.sender}
      isNew={index === messages.length - 1}
      status={item.status}
      timestamp={item.timestamp}
    >
      <Text
        style={[
          styles.messageText,
          {
            color:
              item.sender === 'user'
                ? theme.colors.primary.contrast
                : theme.colors.text.primary,
          },
        ]}
      >
        {item.text}
      </Text>
    </AnimatedMessage>
  );

  return (
    <View style={styles.container}>
      {!isOnline && (
        <Card style={styles.offlineCard} elevation="sm">
          <CardContent style={styles.offlineContent}>
            <Ionicons name="cloud-offline" size={20} color={theme.colors.warning.main} />
            <Text style={styles.offlineText}>
              Нет подключения к интернету. Сообщения будут отправлены при восстановлении соединения.
            </Text>
          </CardContent>
        </Card>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isLoading && (
        <Card style={styles.loadingCard} elevation="sm">
          <CardContent style={styles.loadingContent}>
            <ActivityIndicator size="small" color={theme.colors.primary.main} />
            <Text style={styles.loadingText}>Ассистент ищет ответ...</Text>
          </CardContent>
        </Card>
      )}

      <View style={styles.inputContainer}>
        <Input
          value={input}
          onChangeText={setInput}
          placeholder="Введите сообщение..."
          containerStyle={styles.input}
          startIcon={<Ionicons name="chatbubble-outline" size={20} color={theme.colors.grey[400]} />}
          onSubmitEditing={handleSend}
        />
        <Button
          onPress={handleSend}
          disabled={!input.trim()}
          size="large"
          startIcon={<Ionicons name="send" size={20} color={theme.colors.primary.contrast} />}
        >
          Отправить
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.md,
  },
  messagesList: {
    paddingVertical: theme.spacing.md,
  },
  messageText: {
    ...theme.typography.body1,
  },
  loadingCard: {
    marginVertical: theme.spacing.md,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.secondary,
    ...theme.typography.body2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  input: {
    flex: 1,
  },
  offlineCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.warning.light,
  },
  offlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  offlineText: {
    flex: 1,
    color: theme.colors.warning.dark,
    ...theme.typography.body2,
  },
});
