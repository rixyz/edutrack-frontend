import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ErrorState, LoadingGrid } from "../components/LoadingAndError";
import { AuthService } from "../services/auth.service";
import { getUserDetails } from "../services/user.service";

type PrivateRouteProps<T> = {
  component: (props: T) => React.ReactNode;
  type: "student" | "teacher" | "all";
} & T;

function PrivateRoute<T>({ component, type, ...rest }: PrivateRouteProps<T>) {
  const location = useLocation();
  const Component = component;

  const accessToken = AuthService.getAccessToken();
  const currentUser = AuthService.getCurrentUser();

  const {
    data: userData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getUserDetails,

    enabled: !!accessToken && !!currentUser,
  });

  if (!accessToken || !currentUser) {
    return <Navigate to={`/login`} state={{ from: location }} replace />;
  }

  if (type === "all") {
    return <Component {...(rest as any)} />;
  }

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (isError) {
    return (
      <ErrorState
        title={
          isAxiosError(error) && error.response?.data.error
            ? error.response?.data.error
            : "Error while authroizing"
        }
        message={isAxiosError(error) && error.response?.data.message}
        variant="full"
      />
    );
  }

  if (userData) {
    const role = userData.user.role_name.toLowerCase();

    const hasCorrectRole =
      (type === "teacher" && role === "teacher") ||
      (type === "student" && role === "student");

    if (!hasCorrectRole) {
      const redirectPath =
        role === "teacher" ? "/teacher/dashboard" : "/student/dashboard";
      alert("You do not have the permission to visit this page");
      return <Navigate to={redirectPath} replace />;
    }

    return <Component {...(rest as any)} />;
  }

  return <Navigate to={`/login`} state={{ from: location }} replace />;
}

export default PrivateRoute;
