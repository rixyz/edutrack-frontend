import { Button, Modal } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "../services/notification.service";
import { ApiResponse } from "../types";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemId: number;
  entityName: string;
  deleteFn: (id: number) => Promise<ApiResponse<void>>;
  queryKey: string[];
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  title,
  itemId,
  entityName,
  deleteFn,
  queryKey,
}: DeleteConfirmationModalProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteFn(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      onClose();
      showSuccess(`${entityName} deleted successfully!`);
    },
    onError: (error) => {
      console.error(`Failed to delete ${entityName}:`, error);
      showError(`${error}`);
    },
  });

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={title}
      centered
      classNames={{
        header:
          "dark:bg-gray-800 dark:text-white border-b dark:border-gray-700",
        body: "dark:bg-gray-800",
        close: "dark:text-gray-400 dark:hover:text-white",
      }}
    >
      <div className="space-y-4 dark:bg-gray-800 dark:text-gray-100">
        <p className="dark:text-gray-300">
          Are you sure you want to delete this {entityName.toLowerCase()}? This
          action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 dark:text-white"
          >
            {deleteMutation.isPending
              ? `Deleting ${entityName}...`
              : `Delete ${entityName}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
