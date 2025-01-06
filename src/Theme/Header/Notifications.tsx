import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface Notification {
  id: number;
  text: string;
  date: string;
}

const Notification: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notifying, setNotifying] = useState<boolean>(true);

  const trigger = useRef<HTMLAnchorElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  const notifications: Notification[] = [
    {
      id: 1,
      text: "New update available for your project management tool",
      date: "12 May, 2025",
    },
    {
      id: 2,
      text: "Your weekly report is ready for review",
      date: "24 Feb, 2025",
    },
    {
      id: 3,
      text: "Team meeting scheduled for next week",
      date: "04 Jan, 2025",
    },
    {
      id: 4,
      text: "Performance review deadline approaching",
      date: "01 Dec, 2024",
    },
  ];

  // Close on click outside
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

  // Close if the esc key is pressed
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
          <span className="absolute -top-0.5 -right-0.5 z-10 h-2 w-2 rounded-full bg-red-500">
            <span className="absolute -z-10 inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
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
              Notifications
            </h5>
          </div>

          <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <Link
                  to="#"
                  className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200 mb-1">
                    {notification.text}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {notification.date}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default Notification;
