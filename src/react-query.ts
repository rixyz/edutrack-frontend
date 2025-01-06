import { QueryCache, QueryClient } from "@tanstack/react-query";
import { showError } from "./services/notification.service";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      showError(`${error.message}`);
      console.error("An Error occured");
      console.error(error);
    },
  }),
});
