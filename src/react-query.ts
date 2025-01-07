import { QueryCache, QueryClient } from "@tanstack/react-query";
import { showError } from "./services/notification.service";
import { isAxiosError } from "axios";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (isAxiosError(error))
        showError(
          `${
            isAxiosError(error) && error.response?.data.errors
              ? error.response?.data.errors
              : "Something went wrong!"
          }`
        );
      console.error("An Error occured");

      if (isAxiosError(error) && error.response) {
        console.error(JSON.stringify(error.response.data, null, 4));
      } else {
        console.error(error);
      }
    },
  }),
});
