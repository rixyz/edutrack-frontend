import { Alert, Card, Text } from "@mantine/core";
import { AlertCircle, Loader } from "lucide-react";
import React from "react";

export const LoadingGrid = ({
  count = 1,
  rows = 1,
  variant = "default",
}: {
  count?: number;
  rows?: number;
  variant?: "default" | "compact" | "full";
}) => {
  if (variant === "full") {
    return (
      <div className="min-h-screen p-6 transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-gray-50">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 bg-gray-200 dark:bg-gray-500 rounded-lg shadow-sm"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const LoadingCard = () => {
    if (variant === "compact") {
      return (
        <Card className="p-4 bg-white dark:bg-gray-800 border dark:border-gray-700">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-5 bg-white dark:bg-gray-800 border dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count * rows }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
};

export const LoadingSpinner = ({
  size = "default",
  text = "Loading data...",
}: {
  size?: "small" | "default" | "large";
  text?: string;
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  const textClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="animate-spin mb-4">
        <Loader
          className={`${sizeClasses[size]} text-blue-500 dark:text-blue-400`}
        />
      </div>
      {text && (
        <p className={`${textClasses[size]} text-gray-600 dark:text-gray-400`}>
          {text}
        </p>
      )}
    </div>
  );
};

export const ErrorState = ({
  title,
  message,
  variant = "default",
  action,
}: {
  title?: string;
  message: string;
  variant?: "default" | "compact" | "full";
  action?: React.ReactNode;
}) => {
  if (variant === "compact") {
    return (
      <Alert
        variant="destructive"
        className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      >
        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <Text className="text-red-600 dark:text-red-400">{message}</Text>
      </Alert>
    );
  }

  if (variant === "full") {
    return (
      <div className="min-h-screen  flex items-center justify-center p-6 dark:bg-gray-900 dark:text-white bg-gray-50">
        <div className="text-center max-w-lg">
          <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h3>
          )}
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
      <div className="flex items-start space-x-4">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
        <div>
          {title && (
            <h3 className="text-base font-semibold text-red-900 dark:text-red-100 mb-1">
              {title}
            </h3>
          )}
          <p className="text-red-600 dark:text-red-400">{message}</p>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    </Card>
  );
};

export default {
  LoadingGrid,
  LoadingSpinner,
  ErrorState,
};
