import { FormField } from '@/types/form/formTypes';
import { ValidationError } from '@/types/entities/baseEntity';

export const validateValue = (
  value: any,
  validation?: FormField['validation'],
  fieldName: string = ''
): string | undefined => {
  if (!validation) return;

  // Required field validation
  if (validation.required && !value) {
    return `${fieldName} is required`;
  }

  // String validations
  if (typeof value === 'string') {
    if (validation.minLength && value.length < validation.minLength) {
      return `${fieldName} must be at least ${validation.minLength} characters`;
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      return `${fieldName} must be less than ${validation.maxLength} characters`;
    }
    // Only check pattern if it exists and value is not empty
    if (validation.pattern && value) {
      try {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value)) {
          return `${fieldName} format is invalid`;
        }
      } catch (error) {
        console.error(`Invalid regex pattern for ${fieldName}:`, error);
        return `Invalid validation pattern for ${fieldName}`;
      }
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (validation.min !== undefined && value < validation.min) {
      return `${fieldName} must be greater than ${validation.min}`;
    }
    if (validation.max !== undefined && value > validation.max) {
      return `${fieldName} must be less than ${validation.max}`;
    }
  }
};

export const validateForm = (
  data: Record<string, any>,
  fields: FormField[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  fields.forEach(field => {
    const value = data[field.name];
    const error = validateValue(value, field.validation, field.label);
    
    if (error) {
      errors.push({
        field: field.name,
        message: error
      });
    }
  });

  return errors;
};

export const formatValidationErrors = (
  errors: ValidationError[]
): Record<string, string> => {
  return errors.reduce((acc, { field, message }) => ({
    ...acc,
    [field]: message
  }), {});
};

export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};