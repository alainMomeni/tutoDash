import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Eye, EyeOff, Mail, AlertCircle } from 'lucide-react';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { login } from '@/store/store';
import { useEntityManagement } from '@/hooks/useEntityManagement';
import { FormError } from '@/components/common';
import { EntityName } from '@/config/entities';
import type { FormFieldProps } from '@/types/form/formTypes';

// Form Configuration
export const FORM_CONFIG = {
  buttons: {
    cancel: 'Cancel',
    loading: 'Loading...'
  },
  errors: {
    submit: 'Error submitting form:'
  },
  styles: {
    input: "w-full p-2 border rounded focus:ring-2 focus:ring-blue-500",
    form: "max-w-md mx-auto p-6 bg-white rounded shadow",
    label: "block mb-2 text-sm font-medium",
    buttonContainer: "flex gap-4 mt-6",
    cancelButton: "px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200",
    submitButton: "px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
  }
};

// Login Form Component
export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ 
        email: formData.email, 
        password: formData.password 
      })).unwrap();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="name@company.com"
            required
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Mail className="w-5 h-5 text-gray-400" />
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-5 w-5">
              <svg className="h-full w-full text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <span>Signing in...</span>
          </div>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
};

// Dashboard Form Component
export const DashboardForm = ({ type, id }: { type: EntityName; id?: string }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formError, setFormError] = useState<string>('');
  const { items, loading, error, create, update } = useEntityManagement(type);

  useEffect(() => {
    if (id && items.length > 0) {
      const item = items.find((item: { id: string }) => item.id === id);
      if (item) {
        setFormData(item);
      }
    }
  }, [id, items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await update(id, formData);
      } else {
        await create(formData);
      }
      navigate(`/dashboard/${type}`);
    } catch (err) {
      setFormError(FORM_CONFIG.errors.submit);
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/${type}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {formError && <FormError error={formError} />}
      {error && <FormError error={error} />}
      
      <div className="grid grid-cols-1 gap-6">
        {Object.entries(formData).map(([key, value]) => (
          <FormField
            key={key}
            field={{ name: key, type: 'text' }}
            value={value}
            onChange={(newValue: string | number) => setFormData(prev => ({ ...prev, [key]: newValue }))}
            error=""
            disabled={loading}
          />
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className={FORM_CONFIG.styles.cancelButton}
        >
          {FORM_CONFIG.buttons.cancel}
        </button>
        <button
          type="submit"
          disabled={loading}
          className={FORM_CONFIG.styles.submitButton}
        >
          {loading ? FORM_CONFIG.buttons.loading : (id ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

// Form Field Component
export const FormField = ({ field, value, onChange, error, disabled }: FormFieldProps) => {
  const { items: relatedItems } = useEntityManagement(field.relation?.entity as EntityName);
  
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={FORM_CONFIG.styles.input}
            placeholder={field.placeholder}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            className={FORM_CONFIG.styles.input}
            placeholder={field.placeholder}
          />
        );
      case 'enum':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={FORM_CONFIG.styles.input}
          >
            <option value="">Select {field.label}</option>
            {field.relation ? (
              relatedItems.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item[field.relation!.labelField]}
                </option>
              ))
            ) : (
              field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))
            )}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label className={FORM_CONFIG.styles.label}>
        {field.label || field.name}
      </label>
      {renderField()}
      {error && <FormError error={error} />}
    </div>
  );
};

export default {
  LoginForm,
  DashboardForm,
  FormField,
  FORM_CONFIG
}; 