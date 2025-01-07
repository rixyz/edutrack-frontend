import { Badge, NavLink, rem, ScrollArea } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Book,
  BookOpen,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Scroll,
  Users,
} from "lucide-react";
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorState, LoadingGrid } from "../components/LoadingAndError";
import { fetchAssignments } from "../services/academic.service";
import { getUserDetails } from "../services/user.service";
import { getAssignmentStatus } from "../utils";

interface NavItemProps {
  label: string;
  to: string;
  icon: React.ReactNode;
  onNavItemClick?: () => void;
  badge?: number;
}

const StudentAssignmentNavItem = () => {
  const useAssignmentCount = () => {
    const {
      isPending: isAssignmentPending,
      isError: isAssignmentError,
      data: response,
    } = useQuery({
      queryKey: ["assignments"],
      queryFn: () => fetchAssignments("student"),
    });

    const leftToSubmitAssignments = useMemo(() => {
      if (!response?.data) return [];

      return response.data.filter((assignment) => {
        const { isSubmitted } = getAssignmentStatus(assignment);
        return !isSubmitted;
      });
    }, [response]);

    if (isAssignmentPending || isAssignmentError) return 0;

    return leftToSubmitAssignments.length;
  };

  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === "/student/assignment";

  const handleClick = () => {
    navigate("/student/assignment");
  };

  return (
    <NavLink
      label="Assignments"
      leftSection={
        <Bell style={{ width: rem(20), height: rem(20) }} strokeWidth={1.5} />
      }
      onClick={handleClick}
      active={isActive}
      variant={isActive ? "filled" : "subtle"}
      color="blue"
      className={`
        mb-2 rounded-lg transition-all duration-300
        ${
          isActive
            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-gray-100"
        }
      `}
      rightSection={
        <Badge variant="filled" color="blue" size="sm" radius="xl">
          {useAssignmentCount()}
        </Badge>
      }
    />
  );
};

const TeacherAssignmentNavItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === "/teacher/assignment";

  const handleClick = () => {
    navigate("/teacher/assignment");
  };

  return (
    <NavLink
      label="Manage Assignments"
      leftSection={
        <ClipboardList
          style={{ width: rem(20), height: rem(20) }}
          strokeWidth={1.5}
        />
      }
      onClick={handleClick}
      active={isActive}
      variant={isActive ? "filled" : "subtle"}
      color="blue"
      className={`
        mb-2 rounded-lg transition-all duration-300
        ${
          isActive
            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-gray-100"
        }
      `}
    />
  );
};

const NavItem = ({ label, to, icon, onNavItemClick, badge }: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleClick = () => {
    navigate(to);
    if (onNavItemClick) {
      onNavItemClick();
    }
  };

  return (
    <NavLink
      label={label}
      leftSection={icon}
      onClick={handleClick}
      active={isActive}
      variant={isActive ? "filled" : "subtle"}
      color="blue"
      className={`
        mb-2 rounded-lg transition-all duration-300
        ${
          isActive
            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-gray-100"
        }
      `}
      rightSection={
        badge ? (
          <Badge variant="filled" color="blue" size="sm" radius="xl">
            {badge}
          </Badge>
        ) : null
      }
    />
  );
};

const NavBar = ({ toggleHeader }: { toggleHeader: () => void }) => {
  const navigate = useNavigate();
  const {
    data: userData,
    isPending: isUserPending,
    isError: isUserError,
    error: userError,
  } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getUserDetails,
  });

  if (isUserPending) {
    return <LoadingGrid variant="full" />;
  }

  if (isUserError) {
    return (
      <ErrorState
        title="Error while fetching user details"
        message={userError.message}
        error={userError}
        variant="full"
      />
    );
  }

  const role = userData.user.role_name.toLowerCase();

  const studentNavItems: NavItemProps[] = [
    {
      label: "Dashboard",
      to: "/student/dashboard",
      icon: (
        <LayoutDashboard
          style={{ width: rem(20), height: rem(20) }}
          strokeWidth={1.5}
        />
      ),
    },
    {
      label: "Routine",
      to: "/student/routine",
      icon: (
        <Calendar
          style={{ width: rem(20), height: rem(20) }}
          strokeWidth={1.5}
        />
      ),
    },
    {
      label: "Result",
      to: "/student/result",
      icon: (
        <Scroll style={{ width: rem(20), height: rem(20) }} strokeWidth={1.5} />
      ),
    },
    {
      label: "Courses",
      to: "/student/course",
      icon: (
        <Book style={{ width: rem(20), height: rem(20) }} strokeWidth={1.5} />
      ),
    },
  ];

  const teacherNavItems: NavItemProps[] = [
    {
      label: "Dashboard",
      to: "/teacher/dashboard",
      icon: (
        <LayoutDashboard
          style={{ width: rem(20), height: rem(20) }}
          strokeWidth={1.5}
        />
      ),
    },
    {
      label: "Students",
      to: "/teacher/students",
      icon: (
        <Users style={{ width: rem(20), height: rem(20) }} strokeWidth={1.5} />
      ),
    },
    {
      label: "Manage Courses",
      to: "/teacher/course",
      icon: (
        <BookOpen
          style={{ width: rem(20), height: rem(20) }}
          strokeWidth={1.5}
        />
      ),
    },
  ];

  const navItems = role === "teacher" ? teacherNavItems : studentNavItems;

  return (
    <div className="h-full flex flex-col dark:bg-gray-800 dark:text-white bg-gray-50 border-r border-gray-200 dark:border-gray-900">
      <ScrollArea.Autosize
        mah="calc(100vh - 200px)"
        scrollbarSize={6}
        scrollHideDelay={500}
        className="flex-grow px-2 pt-4"
      >
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            label={item.label}
            to={item.to}
            icon={item.icon}
            onNavItemClick={toggleHeader}
            badge={item.badge}
          />
        ))}

        {role === "teacher" ? (
          <TeacherAssignmentNavItem />
        ) : (
          <StudentAssignmentNavItem />
        )}
      </ScrollArea.Autosize>

      <div className="border-t border-gray-200 dark:border-gray-900 p-2 mt-auto">
        <NavLink
          label="Logout"
          leftSection={
            <LogOut
              style={{ width: rem(20), height: rem(20) }}
              strokeWidth={1.5}
            />
          }
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          variant="subtle"
          color="red"
          className="rounded-lg hover:bg-red-50 hover:text-red-600"
        />
      </div>
    </div>
  );
};

export default NavBar;
