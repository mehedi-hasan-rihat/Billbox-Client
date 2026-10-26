export type AuthFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        name?: string[];
        form?: string[];
      };
      message?: string;
    }
  | undefined;
