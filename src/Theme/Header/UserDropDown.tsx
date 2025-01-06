import { useQuery } from "@tanstack/react-query";
import { LogOut, Mail, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { API_URL } from "../../services/api";
import { getUserDetails } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";

const DropdownUser: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<HTMLDivElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  const logout = () => {
    AuthService.logout();
    window.location.href = "/";
  };

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

  const {
    data: userData,
    isPending: userDataLoading,
    error: userDataError,
  } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getUserDetails,
  });

  if (userDataLoading)
    return (
      <div className="relative">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md transition-colors ">
          <div className="hidden md:block text-right h-10 w-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-100">
                Loading
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (userDataError)
    return (
      <div className="relative">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md transition-colors ">
          <div className="hidden md:block text-right h-10 w-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-sm font-medium text-red-600 dark:text-red-400">
                Error
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="relative">
      <div
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md transition-colors "
      >
        <div className="hidden md:block text-right">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            {userData.user.first_name} {userData.user.last_name}
          </span>
        </div>

        <div className="h-10 w-10 rounded-full overflow-hidden">
          <img
            src={`http://${API_URL}${userData.user.profile_picture}`}
            alt="User"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {dropdownOpen && (
        <div
          ref={dropdown}
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src={`http://${API_URL}${userData.user.profile_picture}`}
                alt="User"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {" "}
                  {userData.user.first_name} {userData.user.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {userData.user.role_name}
                </p>
              </div>
            </div>
          </div>

          <nav className="py-1">
            <div
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Mail className="mr-3 text-gray-500" size={20} />
              {userData.user.email}
            </div>

            <div
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Phone className="mr-3 text-gray-500" size={20} />
              {userData.user.phone}
            </div>
          </nav>

          <div className="border-t border-gray-200 py-1">
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="mr-3 text-red-500" size={20} />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownUser;
