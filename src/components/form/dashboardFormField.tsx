import { useEffect, useState } from 'react';
import { FORM_CONFIG } from "./metadata/formConfig";
import { FormField as FormFieldType } from '@/types/form/formTypes';
import { useApi } from '@/hooks/useApi';

interface FormFieldProps {
  field: FormFieldType;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  disabled?: boolean;
}

export const FormField = ({ field, value, onChange, error, disabled }: FormFieldProps) => {
  const [relationOptions, setRelationOptions] = useState<Array<{ value: string, label: string, prix?: number }>>([]);
  const { type, name, label, placeholder, validation, relation } = field;

  // Only fetch related data if field has relation
  const { items: relatedItems } = useApi(relation?.entity || 'product');

  useEffect(() => {
    if (relation && relatedItems) {
      console.log('🔄 Loading relation options:', relatedItems);
      const options = relatedItems.map(item => ({
        value: item[relation.valueField],
        label: item[relation.labelField],
        prix: item.prix
      }));
      console.log('📦 Relation options:', options);
      setRelationOptions(options);
    }
  }, [relation, relatedItems]);

  const isReadOnly = name === 'prix_total';
  const selectedProduct = relationOptions.find(opt => opt.value === value);

  const baseProps = {
    id: name,
    name,
    disabled: disabled || isReadOnly,
    required: validation?.required,
    className: `${FORM_CONFIG.styles.input} ${
      error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
    } ${isReadOnly ? 'bg-gray-100' : ''}`,
    ...validation
  };

  const renderField = () => {
    if (name === 'prix_total') {
      const displayValue = selectedProduct?.prix || value;
      return (
        <div className="relative">
          <input
            type="text"
            {...baseProps}
            value={displayValue ? `${Number(displayValue).toFixed(2)} €` : ''}
            readOnly
          />
        </div>
      );
    }

    if (type === 'enum' || relation) {
      const options = relation ? relationOptions : (field.options || []);
      return (
        <select 
          {...baseProps}
          value={value || ''}
          onChange={onChange}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map(opt => 
            typeof opt === 'string' ? (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ) : (
              <option key={opt.value} value={opt.value}>
                {opt.label} {/* Removed price display here */}
              </option>
            )
          )}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea 
          {...baseProps}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
        />
      );
    }

    return (
      <input
        type={type}
        {...baseProps}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
      />
    );
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className={FORM_CONFIG.styles.label}>
        {label}
        {validation?.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderField()}

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};