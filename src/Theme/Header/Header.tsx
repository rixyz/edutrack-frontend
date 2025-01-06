import { useEffect, useState } from "react";
import logo from "/src/assets/img/logo.png";

import { Moon, Search, SunDim } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MessageList from "./MessageList";
import Notification from "./Notifications";
import DropdownUser from "./UserDropDown";
import { Burger } from "@mantine/core";

type HeaderProps = {
  openHeader: boolean
  toggleHeader: () => void
} 

const Header = ({ openHeader, toggleHeader }: HeaderProps) => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/users/search?query=${query}`);
  };
  return (
    <div className="flex flex-grow items-center justify-between px-0 shadow-2 md:px-6 2xl:px-11 dark:bg-gray-800 dark:text-white bg-gray-50 border-b border-gray-200 dark:border-gray-900">
      <div className="flex-shrink-0 flex items-center">
        <img className="hidden lg:block h-10 w-auto" src={logo} alt="Logo" />
        <Burger
          opened={openHeader}
          color="#60a5fa"
          onClick={toggleHeader}
          hiddenFrom="sm"
          size="sm"
          className="m-2"
        />
      </div>
      <div className="">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="flex items-center gap-3 2xsm:gap-7">
        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4 p-4">
            <DarkModeSwitcher />
            <Notification />
            <MessageList />
          </ul>
          <div className="hidden md:block">
            <DropdownUser />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

const DarkModeSwitcher = () => {
  function useLocalStorage(key: string, initialValue: string) {
    const [storedValue, setStoredValue] = useState(() => {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(error);
        return initialValue;
      }
    });

    useEffect(() => {
      try {
        const valueToStore =
          typeof storedValue === "function"
            ? storedValue(storedValue)
            : storedValue;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
  }

  const useColorMode = () => {
    const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

    useEffect(() => {
      const className = "dark";
      const bodyClass = window.document.body.classList;

      return colorMode === "dark"
        ? bodyClass.add(className)
        : bodyClass.remove(className);
    }, [colorMode]);

    return [colorMode, setColorMode];
  };

  const [colorMode, setColorMode] = useColorMode();
  return (
    <li>
      <label
        className={`relative m-0 block h-7 w-14 rounded-full  ${
          colorMode === "dark" ? "bg-gray-900" : "bg-gray-300"
        }`}
      >
        <input
          type="checkbox"
          onChange={() => {
            if (typeof setColorMode === "function") {
              setColorMode(colorMode === "light" ? "dark" : "light");
            }
          }}
          className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
            colorMode === "dark" && "!right-[3px] !translate-x-full"
          }`}
        >
          <span className="dark:hidden">
            <SunDim className="text-gray-500" />
          </span>
          <span className="hidden dark:inline-block">
            <Moon className="text-gray-500" />
          </span>
        </span>
      </label>
    </li>
  );
};

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
    </form>
  );
};
