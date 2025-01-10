import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { generateFormSchema } from '@/utils/schemaGenerators';
import { FormProps } from '@/types/form/formTypes';
import { FormField } from './dashboardFormField';
import { FormError } from '@/components/common';
import { FORM_CONFIG } from './metadata/formConfig';
import { useForm } from '../../hooks/useForm';
import { RootState } from '@/store/store';

const DashboardForm = ({ id, type }: FormProps) => {
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.form);
  const { 
    formData, 
    formErrors,
    isSubmitting,
    handleChange, 
    handleSubmit,
    handleCancel, // Add this
    resetForm
  } = useForm(type, id);

  const config = generateFormSchema(type);
  const isEditing = Boolean(id);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(config.fields);
    if (success) {
      resetForm();
      navigate(`/dashboard/${type}`, { replace: true }); // Use replace here too
    }
  };

  return (
    <form onSubmit={onSubmit} className={FORM_CONFIG.styles.form}>
      {error && <FormError error={error} />}

      {config.fields.map(field => (
        <div key={field.name} className="space-y-1">
          <FormField
            field={field}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(e, field.validation)}
            error={formErrors[field.name]}
            disabled={loading || isSubmitting}
          />
        </div>
      ))}

      <div className={FORM_CONFIG.styles.buttonContainer}>
        <button
          type="button"
          onClick={handleCancel} // Use the new cancel handler
          disabled={loading || isSubmitting}
          className={FORM_CONFIG.styles.cancelButton}
        >
          {FORM_CONFIG.buttons.cancel}
        </button>
        <button
          type="submit"
          disabled={loading || isSubmitting}
          className={FORM_CONFIG.styles.submitButton}
        >
          {loading || isSubmitting ? (
            <div className="flex items-center space-x-2">
              <span>{FORM_CONFIG.buttons.loading}</span>
            </div>
          ) : (
            config.titles.button[isEditing ? 'edit' : 'create']
          )}
        </button>
      </div>
    </form>
  );
};

export default DashboardForm;