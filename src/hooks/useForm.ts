import { useState, useEffect, useCallback } from 'react';
import { FormField } from '@/types/form/formTypes';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { resetForm as resetFormAction } from '@/store/slices/formSlice';
import { useNavigate } from 'react-router-dom';
import { entities, EntityName } from '@/config/entities';
import { DataItem } from '@/types/table/tableType';
import { useEntityManagement } from '@/hooks/useEntityManagement';

export const useForm = (type: EntityName, id?: string) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, loading, error, create, update } = useEntityManagement(type);
  const { items: productItems } = useEntityManagement('product');
  
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const entityConfig = entities[type];
    const defaultValues = entityConfig.fields.reduce((acc, field) => {
      if ('hideInForm' in field && field.hideInForm && 'defaultValue' in field && field.defaultValue !== undefined) {
        console.log(`🔧 Setting default value for ${field.name}:`, field.defaultValue);
        acc[field.name] = field.defaultValue;
      }
      return acc;
    }, {} as Record<string, any>);

    console.log('📝 Initial form data:', defaultValues);
    return defaultValues;
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    console.log('🧹 useForm: Resetting form state');
    setFormData({});
    setFormErrors({});
    setIsSubmitting(false);
    dispatch(resetFormAction());
  }, [dispatch]);

  const handleCancel = useCallback(() => {
    console.log('❌ useForm: Cancel clicked, navigating back to table');
    resetForm();
    navigate(-1);
  }, [navigate, resetForm]);

  useEffect(() => {
    console.log('🔄 useForm: Form mounted for type:', type, 'with id:', id);
    return () => {
      console.log('🔚 useForm: Form unmounting, cleaning up...');
      resetForm();
    };
  }, [type, id, resetForm]);

  useEffect(() => {
    if (id && items.length > 0) {
      const item = items.find((item: DataItem) => item.id === id);
      if (item) {
        setFormData(item);
      }
    }
  }, [id, items]);

  const validateField = (value: any, field: FormField) => {
    const { validation } = field;
    if (!validation) return '';

    if (validation.required && !value) {
      return 'This field is required';
    }

    if (typeof value === 'string') {
      if (validation.minLength && value.length < validation.minLength) {
        return `Minimum length is ${validation.minLength} characters`;
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        return `Maximum length is ${validation.maxLength} characters`;
      }
    }

    if (typeof value === 'number') {
      if (validation.min !== undefined && value < validation.min) {
        return `Minimum value is ${validation.min}`;
      }
      if (validation.max !== undefined && value > validation.max) {
        return `Maximum value is ${validation.max}`;
      }
    }

    return '';
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: FormField
  ) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number | boolean = value;

    if (type === 'number') {
      parsedValue = Number(value) || 0;
    } else if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData(prev => {
      const newData = { ...prev, [name]: parsedValue };

      if (name === 'product' && value) {
        const selectedProduct = productItems.find(item => item.id === value);
        console.log('Selected product:', selectedProduct);
        
        if (selectedProduct) {
          newData.prix_total = selectedProduct.prix;
          console.log('💰 Updated total price:', selectedProduct.prix);
        }
      }

      return newData;
    });

    const error = validateField(parsedValue, field);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = (fields: FormField[]) => {
    const errors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(formData[field.name], field);
      if (error) {
        errors[field.name] = error;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (fields: FormField[]) => {
    setIsSubmitting(true);
    
    try {
      if (!validateForm(fields)) {
        throw new Error('Please fix the form errors');
      }

      const entityConfig = entities[type];
      const hiddenDefaults = entityConfig.fields.reduce((acc, field) => {
        if ('hideInForm' in field && field.hideInForm && 'defaultValue' in field && field.defaultValue !== undefined) {
          acc[field.name] = field.defaultValue;
        }
        return acc;
      }, {} as Record<string, any>);

      const dataToSubmit = {
        ...hiddenDefaults,
        ...formData
      };

      console.log('📤 Submitting data:', dataToSubmit);

      const result = id
        ? await update(id, dataToSubmit)
        : await create(dataToSubmit);

      if (!result) {
        throw new Error('Failed to save data');
      }

      return true;
    } catch (error) {
      console.error('❌ Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    formErrors,
    isSubmitting,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleCancel,
    resetForm
  };
};