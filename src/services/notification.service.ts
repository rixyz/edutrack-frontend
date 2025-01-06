import { notifications } from "@mantine/notifications";

export function showSuccess(message: string) {
  notifications.show({
    withCloseButton: true,
    autoClose: 5000,
    title: "Sucess",
    message,
    color: "green",
    withBorder: true,
    classNames: {
      root: 'dark:bg-gray-700 border dark:border-gray-900',
      title: 'dark:text-gray-200',
      description: 'dark:text-gray-200',
      closeButton: 'dark:text-gray-200 dark:hover:bg-gray-900'
    },
  });
}

export function showError(message: string) {
  notifications.show({
    withCloseButton: true,
    autoClose: 5000,
    title: "Something went wrong!",
    message,
    color: "red",
    withBorder: true,
    classNames: {
      root: 'dark:bg-gray-700 border dark:border-gray-900',
      title: 'dark:text-gray-200',
      description: 'dark:text-gray-200',
      closeButton: 'dark:text-gray-200 dark:hover:bg-gray-900'
    },
  });
}