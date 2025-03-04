import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AuthorPicker = ({ traders, onSelect, initialValue }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    if (initialValue && traders.length > 0) {
      setSelectedAuthor(initialValue);
    } else if (traders.length > 0) {
      setSelectedAuthor(traders[0].whatsapp);
    }
  }, [initialValue, traders]);

  const handleSelect = (whatsapp) => {
    setSelectedAuthor(whatsapp);
    onSelect(whatsapp);
  };

  if (!traders || traders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Выберите автора:</Text>
        <Text style={styles.noAuthorsText}>Нет доступных авторов</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Выберите автора:</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {traders.map((trader) => (
          <TouchableOpacity
            key={trader.whatsapp}
            style={[
              styles.authorButton,
              selectedAuthor === trader.whatsapp && styles.selectedAuthorButton
            ]}
            onPress={() => handleSelect(trader.whatsapp)}
          >
            <Ionicons 
              name="person-circle-outline" 
              size={24} 
              color={selectedAuthor === trader.whatsapp ? "#fff" : "#007bff"} 
            />
            <Text 
              style={[
                styles.authorName,
                selectedAuthor === trader.whatsapp && styles.selectedAuthorName
              ]}
            >
              {trader.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingVertical: 4,
  },
  authorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedAuthorButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  selectedAuthorName: {
    color: '#fff',
  },
  noAuthorsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  }
});

export default AuthorPicker; 