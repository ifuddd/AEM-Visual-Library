// Component types
export * from './component';

// Fragment types
export * from './fragment';

// Pattern types
export * from './pattern';

// Sync types
export * from './sync';

// Contribution types
export * from './contribution';

// User types
export * from './user';

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

/**
 * API Error
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
