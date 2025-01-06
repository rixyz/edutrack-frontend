import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../services/api";
import { ChatAPI } from "../../services/chat.service";

const List = () => {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} min ago`;
    return "just now";
  };

  const {
    isPending,
    isError,
    data: messages,
    error,
  } = useQuery({
    queryKey: ["messages"],
    queryFn: ChatAPI.fetchAllMessages,
  });

  if (isError) {
    return (
      <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
        <li>
          <div className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <div className="flex-grow">
              <h6 className="text-sm font-medium text-gray-900 dark:text-white">
                {isAxiosError(error) && error.response?.data.error
                  ? error.response?.data.error
                  : error.name}
              </h6>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isAxiosError(error) && error.response?.data.message
                  ? error.response?.data.message
                  : error.message}
              </p>
            </div>
          </div>
        </li>
      </ul>
    );
  }

  if (isPending) {
    return (
      <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
        <li>
          <div className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <div className="flex-grow">
              <h6 className="text-sm font-medium text-gray-900 dark:text-white">
                Loading
              </h6>
            </div>
          </div>
        </li>
      </ul>
    );
  }

  return (
    <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
      {messages.map((message) => (
        <li key={message.user.id}>
          <Link
            to={"message/" + message.user.id}
            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="mr-3 flex-shrink-0">
              <img
                src={`http://${API_URL}${message.user.profile_picture}`}
                alt={`${message.user.first_name} ${message.user.last_name}`}
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>

            <div className="flex-grow">
              <h6 className="text-sm font-medium text-gray-900 dark:text-white">
                {message.user.first_name}
              </h6>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {message.last_message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(message.last_message_time)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const MessageList: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notifying, setNotifying] = useState<boolean>(true);

  const trigger = useRef<HTMLAnchorElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (!dropdown.current || !trigger.current) return;

      if (
        !dropdownOpen ||
        dropdown.current.contains(event.target as Node) ||
        trigger.current.contains(event.target as Node)
      )
        return;

      setDropdownOpen(false);
    };

    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (!dropdownOpen || event.key !== "Escape") return;
      setDropdownOpen(false);
    };

    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [dropdownOpen]);

  return (
    <li className="relative">
      <Link
        ref={trigger}
        onClick={() => {
          setNotifying(false);
          setDropdownOpen(!dropdownOpen);
        }}
        to="#"
        className="relative flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        {notifying && (
          <span className="absolute -top-0.5 -right-0.5 z-10 h-2 w-2 rounded-full bg-blue-500">
            <span className="absolute -z-10 inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
          </span>
        )}

        <svg
          className="h-5 w-5 text-gray-600 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </Link>

      {dropdownOpen && (
        <div
          ref={dropdown}
          className="absolute right-0 mt-2 w-72 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Messages
            </h5>
          </div>

          <List />
        </div>
      )}
    </li>
  );
};

export default MessageList;
