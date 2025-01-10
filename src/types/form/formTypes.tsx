import { EntityType } from "../schema";

export interface FormPageProps {
  type: EntityType;
}

export interface FormField {
  type: 'text' | 'number' | 'textarea' | 'enum';
  name: string;
  label: string;
  placeholder?: string;
  options?: readonly string[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  relation?: {
    entity: EntityType;
    labelField: string;
    valueField: string;
  };
}

export interface FormConfig {
  titles: {
    page: {
      create: string;
      edit: string;
    };
    button: {
      create: string;
      edit: string;
    };
  };
  fields: FormField[];
}

export interface FormProps {
  id?: string;
  type: EntityType;
}
