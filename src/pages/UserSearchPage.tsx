import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useSearchParams } from "react-router-dom";
import { ErrorState, LoadingGrid } from "../components/LoadingAndError";
import UserCard from "../components/UserCard";
import { searchUsers } from "../services/user.service";

const UserSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const {
    data: users,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", query],
    queryFn: () => searchUsers(query),
    enabled: !!query,
  });

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (isError) {
    return (
      <ErrorState
        title={
          isAxiosError(error) && error.response?.data.error
            ? error.response?.data.error
            : "Error while fetching Users"
        }
        message={
          isAxiosError(error) && error.response?.data.message
            ? error.response?.data.message
            : error.message
        }
        variant="full"
      />
    );
  }

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-gray-50">
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">
          Search Results for "{query}"
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users?.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSearchPage;
