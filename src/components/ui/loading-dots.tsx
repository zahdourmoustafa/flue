import { cn } from "@/lib/utils";

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  variant?: "dots" | "spinner" | "pulse";
  className?: string;
  text?: string;
}

export function LoadingDots({
  size = "md",
  variant = "dots",
  className,
  text,
}: LoadingDotsProps) {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const spinnerSizeClasses = {
    sm: "w-3 h-3 border",
    md: "w-4 h-4 border-2",
    lg: "w-5 h-5 border-2",
  };

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div
          className={cn(
            "border-gray-400 border-t-transparent rounded-full animate-spin",
            spinnerSizeClasses[size]
          )}
        />
        {text && (
          <span className={cn("text-gray-600", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div
          className={cn(
            "bg-gray-400 rounded-full animate-pulse",
            sizeClasses[size]
          )}
        />
        {text && (
          <span
            className={cn("text-gray-600 animate-pulse", textSizeClasses[size])}
          >
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default: bouncing dots
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-1">
        <div
          className={cn(
            "bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]",
            sizeClasses[size]
          )}
        />
        <div
          className={cn(
            "bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]",
            sizeClasses[size]
          )}
        />
        <div
          className={cn(
            "bg-gray-400 rounded-full animate-bounce",
            sizeClasses[size]
          )}
        />
      </div>
      {text && (
        <span className={cn("text-gray-600", textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  );
}

// Convenience components for common use cases
export function LoadingSpinner({
  size = "md",
  text,
  className,
}: Omit<LoadingDotsProps, "variant">) {
  return (
    <LoadingDots
      variant="spinner"
      size={size}
      text={text}
      className={className}
    />
  );
}

export function LoadingPulse({
  size = "md",
  text,
  className,
}: Omit<LoadingDotsProps, "variant">) {
  return (
    <LoadingDots
      variant="pulse"
      size={size}
      text={text}
      className={className}
    />
  );
}

export function ThreeDots({
  size = "md",
  text,
  className,
}: Omit<LoadingDotsProps, "variant">) {
  return (
    <LoadingDots variant="dots" size={size} text={text} className={className} />
  );
}
