import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

const MESSAGES_STORAGE_KEY = '@assistant_messages';
const PENDING_MESSAGES_KEY = '@pending_messages';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  status: 'sent' | 'pending' | 'error';
}

interface UseMessagesProps {
  apiUrl: string;
  initialMessage?: string;
}

export const useMessages = ({ apiUrl, initialMessage = 'Привет! Чем могу помочь?' }: UseMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Load messages from storage on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        } else {
          const initialMsg: Message = {
            id: '0',
            text: initialMessage,
            sender: 'bot',
            timestamp: Date.now(),
            status: 'sent',
          };
          setMessages([initialMsg]);
          await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify([initialMsg]));
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, [initialMessage]);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      if (state.isConnected) {
        sendPendingMessages();
      }
    });

    return () => unsubscribe();
  }, []);

  // Save messages to storage whenever they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving messages:', error);
      }
    };

    saveMessages();
  }, [messages]);

  const sendPendingMessages = useCallback(async () => {
    try {
      const pendingMessages = await AsyncStorage.getItem(PENDING_MESSAGES_KEY);
      if (pendingMessages) {
        const messages = JSON.parse(pendingMessages);
        for (const message of messages) {
          await sendMessage(message.text, true);
        }
        await AsyncStorage.removeItem(PENDING_MESSAGES_KEY);
      }
    } catch (error) {
      console.error('Error sending pending messages:', error);
    }
  }, []);

  const generateMessageId = () => {
    return Date.now().toString();
  };

  const addMessage = (text: string, sender: 'user' | 'bot', status: 'sent' | 'pending' | 'error' = 'sent') => {
    const newMessage: Message = {
      id: generateMessageId(),
      text,
      sender,
      timestamp: Date.now(),
      status,
    };

    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const sendMessage = async (text: string, isRetry = false) => {
    if (!text.trim()) return;

    const userMessage = addMessage(text, 'user', isOnline ? 'sent' : 'pending');

    if (!isOnline && !isRetry) {
      try {
        const pendingMessages = await AsyncStorage.getItem(PENDING_MESSAGES_KEY);
        const messages = pendingMessages ? JSON.parse(pendingMessages) : [];
        messages.push(userMessage);
        await AsyncStorage.setItem(PENDING_MESSAGES_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving pending message:', error);
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(apiUrl, { question: text });
      addMessage(response.data.response, 'bot');
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Ошибка сервера. Попробуйте позже.', 'bot', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = async () => {
    try {
      await AsyncStorage.removeItem(MESSAGES_STORAGE_KEY);
      await AsyncStorage.removeItem(PENDING_MESSAGES_KEY);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  };

  return {
    messages,
    isLoading,
    isOnline,
    sendMessage,
    clearMessages,
  };
}; 