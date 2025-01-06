import {
  Button,
  Modal,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateTimePicker, DateValue } from "@mantine/dates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { createAssignment, editAssignment } from "../services/academic.service";
import { getUserDetails } from "../services/user.service";
import { Assignment, AssignmentFormData, Subject } from "../types";
import { showError, showSuccess } from "../services/notification.service";

export const AssignmentModal = ({
  isOpen,
  onClose,
  initialData = null,
  mode = "create",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Assignment | null;
  mode: "create" | "edit";
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<AssignmentFormData>({
    title: "",
    description: "",
    subject: 1,
    due_date: new Date(Date.now() + 60 * 60 * 1000),
    max_score: 100,
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        subject: initialData.subject || 1,
        due_date: new Date(initialData.due_date),
        max_score: initialData.max_score || 100,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        subject: 1,
        due_date: new Date(Date.now() + 60 * 60 * 1000),
        max_score: 100,
      });
    }
  }, [initialData, mode, isOpen]);

  const { data: teacherDetail } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserDetails(),
  });

  const subjectsData = useMemo(() => {
    if (!teacherDetail || !("subjects" in teacherDetail)) return [];

    const subjects: Subject[] = teacherDetail.subjects || [];

    return subjects.map((subject) => ({
      value: subject.id.toString(),
      label: `${subject.name} (${subject.code})`,
    }));
  }, [teacherDetail]);

  const mutation = useMutation({
    mutationFn: (data: AssignmentFormData) =>
      mode === "create"
        ? createAssignment(data)
        : editAssignment(initialData!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      onClose();
      showSuccess(`Assignment ${mode==="create" ? 'created' : 'edited'} successfully!`);
    },
    onError: (error) => {
      showError(`${error}`);
      console.error("Failed to save assignment:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    field: keyof AssignmentFormData,
    value: string | number | DateValue
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const minDateTime = useMemo(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date;
  }, []);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create New Assignment" : "Edit Assignment"}
      size="lg"
      classNames={{
        header:
          "dark:bg-gray-800 dark:text-white border-b dark:border-gray-700",
        body: "dark:bg-gray-800",
        close: "dark:text-gray-400 dark:hover:text-white",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 dark:bg-gray-800 dark:text-gray-100"
      >
        <TextInput
          required
          label="Title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter assignment title"
          classNames={{
            input: "dark:bg-gray-700 dark:text-white dark:border-gray-600",
            label: "dark:text-gray-200",
          }}
        />

        <Select
          required
          label="Subject"
          value={formData.subject.toString()}
          onChange={(value) => handleChange("subject", Number(value))}
          data={subjectsData}
          placeholder="Select a subject"
          error={subjectsData.length === 0 ? "No subjects available" : null}
          classNames={{
            input: "dark:bg-gray-700 dark:text-white dark:border-gray-600",
            label: "dark:text-gray-200",
            dropdown:
              "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200",
          }}
        />

        <Textarea
          required
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter assignment description"
          minRows={3}
          classNames={{
            input: "dark:bg-gray-700 dark:text-white dark:border-gray-600",
            label: "dark:text-gray-200",
          }}
        />

        <NumberInput
          required
          label="Maximum Score"
          value={formData.max_score}
          onChange={(value) => handleChange("max_score", Number(value))}
          min={0}
          max={100}
          placeholder="Enter maximum score"
          classNames={{
            input: "dark:bg-gray-700 dark:text-white dark:border-gray-600",
            label: "dark:text-gray-200",
            control: "dark:border-gray-600 dark:hover:bg-gray-600",
          }}
        />

        <DateTimePicker
          required
          label="Due Date"
          value={formData.due_date}
          onChange={(date) => handleChange("due_date", date)}
          minDate={minDateTime}
          placeholder="Select due date"
          clearable={false}
          classNames={{
            input: "dark:bg-gray-700 dark:text-white dark:border-gray-600",
            label: "dark:text-gray-200",
            day: "dark:hover:bg-gray-600 dark:text-gray-200",
            monthCell: "dark:hover:bg-gray-600 dark:text-gray-200",
          }}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="subtle"
            onClick={onClose}
            disabled={mutation.isPending}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={mutation.isPending}
            disabled={mutation.isPending || subjectsData.length === 0}
            className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
          >
            {mode === "create" ? "Create Assignment" : "Save Changes"}
          </Button>
        </div>

        {mutation.isError && (
          <div className="mt-2 text-red-500 dark:text-red-400 text-sm">
            Failed to {mode === "create" ? "create" : "update"} assignment.
            Please try again.
          </div>
        )}
      </form>
    </Modal>
  );
};
