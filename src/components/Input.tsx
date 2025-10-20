import type React from 'react';
import { StyleSheet, Text, TextInput, type TextStyle, View, type ViewStyle } from 'react-native';
import { colors, typography, borderRadius, spacing, layout } from '../theme';

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'decimal-pad' | 'number-pad';
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  error?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  inputStyle,
  error,
  required = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error && styles.inputError,
          !editable && styles.disabled,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        placeholderTextColor={colors.text.disabled}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[2],
    color: colors.text.primary,
  },
  required: {
    color: colors.error.main,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: layout.inputPadding.horizontal,
    paddingVertical: layout.inputPadding.vertical,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    backgroundColor: colors.background.elevated,
  },
  multilineInput: {
    paddingTop: spacing[3],
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error.main,
  },
  disabled: {
    backgroundColor: colors.background.tertiary,
    color: colors.text.disabled,
  },
  errorText: {
    color: colors.error.main,
    fontSize: typography.fontSize.sm,
    marginTop: spacing[1],
  },
});

export default Input;
