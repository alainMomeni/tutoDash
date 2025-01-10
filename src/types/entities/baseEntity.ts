export interface BaseEntity {
    id: string;
    status: boolean;
    date_created?: string;
    date_updated?: string;
    user_created?: string;
    user_updated?: string;
  }
  
  export interface ValidationError {
    field: string;
    message: string;
  }
  
  export interface ApiResponse<T> {
    data: T;
    meta?: {
      total_count?: number;
      filter_count?: number;
    };
    errors?: ValidationError[];
  }