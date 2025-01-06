import { MessageSquare } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../services/api";
import { AuthService } from "../services/auth.service";
import { UserDetail, UserRole } from "../types";

const getRoleStyles = (roleName: UserRole): string => {
  const styles: Record<UserRole | "default", string> = {
    Student: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Teacher:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };
  return styles[roleName] || styles.default;
};

const UserCard: React.FC<{ user: UserDetail }> = ({ user }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img src={`http://${API_URL}${ user.profile_picture}`}
              alt={user.first_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
            <div className="absolute -bottom-1 left-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleStyles(
                  user.role_name
                )}`}
              >
                {user.role_name}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {user.first_name} {user.last_name}
                {user.id === AuthService.getCurrentUserId() && (
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    (You)
                  </span>
                )}
              </h3>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>

            <div className="mt-4">
              <Link
                to={`/message/${user.id}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
