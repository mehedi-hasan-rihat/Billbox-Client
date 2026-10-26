import { AlertCircle } from "lucide-react";

interface AuthFormErrorProps {
  errors?: string[];
}

/**
 * Form-level error banner — shown when the whole form has an error
 * (e.g. network failure, invalid credentials).
 */
export function AuthFormError({ errors }: AuthFormErrorProps) {
  if (!errors?.length) return null;
  return (
    <div className="flex items-start gap-2 rounded-sm border border-destructive/30 bg-destructive/10 px-4 py-3">
      <AlertCircle
        className="mt-px size-3.5 shrink-0 text-destructive"
        strokeWidth={1.5}
      />
      <p className="text-xs text-destructive">{errors[0]}</p>
    </div>
  );
}
