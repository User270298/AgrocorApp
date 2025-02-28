import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Card, CardContent } from './ui/Card';
import { theme } from '../theme';

interface VesselFormProps {
  postType: 'cargo' | 'vessel';
  postData: any;
  onChangePostData: (data: any) => void;
  onSubmit: () => void;
  onToggleType: (type: 'cargo' | 'vessel') => void;
}

export const VesselForm: React.FC<VesselFormProps> = ({
  postType,
  postData,
  onChangePostData,
  onSubmit,
  onToggleType,
}) => {
  const updateField = (field: string, value: string) => {
    onChangePostData({ ...postData, [field]: value });
  };

  return (
    <Card>
      <CardContent>
        <Text style={styles.title}>
          Добавить {postType === 'cargo' ? 'Cargo' : 'Vessel'}
        </Text>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.toggleButton, postType === 'cargo' && styles.selectedButton]}
            onPress={() => onToggleType('cargo')}
          >
            <Text style={styles.toggleButtonText}>Cargo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, postType === 'vessel' && styles.selectedButton]}
            onPress={() => onToggleType('vessel')}
          >
            <Text style={styles.toggleButtonText}>Vessel</Text>
          </TouchableOpacity>
        </View>

        {postType === 'cargo' ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Date at (YYYY-MM-DD)"
              value={postData.date_at}
              onChangeText={(text) => updateField('date_at', text)}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Cargo"
              value={postData.cargo}
              onChangeText={(text) => updateField('cargo', text)}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={postData.quantity}
              onChangeText={(text) => updateField('quantity', text)}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Port of Loading"
              value={postData.port_loading}
              onChangeText={(text) => updateField('port_loading', text)}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Port of Discharge"
              value={postData.port_discharge}
              onChangeText={(text) => updateField('port_discharge', text)}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Rates"
              value={postData.rates}
              onChangeText={(text) => updateField('rates', text)}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Laycan Dates"
              value={postData.laycan}
              onChangeText={(text) => updateField('laycan', text)}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="DWT"
              value={postData.dwt}
              onChangeText={(text) => updateField('dwt', text)}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="BLT"
              value={postData.blt}
              onChangeText={(text) => updateField('blt', text)}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Flag"
              value={postData.flag}
              onChangeText={(text) => updateField('flag', text)}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Open at"
              value={postData.open_at}
              onChangeText={(text) => updateField('open_at', text)}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Availability"
              value={postData.availability}
              onChangeText={(text) => updateField('availability', text)}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.submitButtonText}>Отправить</Text>
        </TouchableOpacity>
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: theme.colors.primary,
  },
  toggleButtonText: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: 12,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 12,
    color: theme.colors.text,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
}); 