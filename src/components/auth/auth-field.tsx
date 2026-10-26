import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "cn";

interface AuthFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  errors?: string[];
  required?: boolean;
}

/**
 * A single labelled input field with inline error display.
 * Used across all auth forms. Follows the design system:
 * mono labels, sm text errors, consistent spacing.
 */
export function AuthField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  errors,
  required,
}: AuthFieldProps) {
  const hasError = !!errors?.length;
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="font-mono text-xs font-medium tracking-[0.04em] text-muted-foreground uppercase"
      >
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={cn(
          "rounded-sm font-mono text-sm",
          hasError && "border-destructive focus-visible:ring-destructive/20"
        )}
      />
      {hasError && (
        <p id={`${id}-error`} className="font-mono text-xs text-destructive">
          {errors![0]}
        </p>
      )}
    </div>
  );
}
