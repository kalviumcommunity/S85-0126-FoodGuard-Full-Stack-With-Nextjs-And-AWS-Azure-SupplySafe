"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
    };

    return (
      <div
        ref={ref}
        className={cn("animate-spin", sizeClasses[size], className)}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <Loader2 className={sizeClasses[size]} />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  className?: string;
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (
    { isLoading, message = "Loading...", children, className, ...props },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
        {isLoading && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50"
            role="status"
            aria-live="polite"
          >
            <Spinner size="lg" />
            {message && (
              <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
LoadingOverlay.displayName = "LoadingOverlay";

interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

const PageLoader = React.forwardRef<HTMLDivElement, PageLoaderProps>(
  ({ className, message = "Loading page...", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-screen flex-col items-center justify-center",
          className
        )}
        role="status"
        aria-live="polite"
        {...props}
      >
        <Spinner size="lg" />
        <p className="mt-4 text-lg text-muted-foreground">{message}</p>
      </div>
    );
  }
);
PageLoader.displayName = "PageLoader";

interface ButtonLoaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  children: React.ReactNode;
  loaderText?: string;
  size?: "sm" | "lg" | "default" | "icon";
}

const ButtonLoader = React.forwardRef<HTMLButtonElement, ButtonLoaderProps>(
  (
    {
      isLoading,
      children,
      loaderText,
      disabled,
      className,
      size = "default",
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "bg-[#0F2A44] text-white hover:bg-[#1a3a5a]",
          sizeClasses[size],
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            {loaderText || "Loading..."}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
ButtonLoader.displayName = "ButtonLoader";

export { Spinner, LoadingOverlay, PageLoader, ButtonLoader };
