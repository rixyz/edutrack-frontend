import {
  Button,
  Modal,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { createCourse, editCourse } from "../services/academic.service";
import { getUserDetails } from "../services/user.service";
import { Course, CourseFormData, Subject } from "../types";
import { showSuccess, showError } from "../services/notification.service";

export const CourseModal = ({
  isOpen,
  onClose,
  initialData = null,
  mode = "create",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Course | null;
  mode: "create" | "edit";
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    subject: 1,
    type: "Theory",
    duration_minutes: 0,
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        subject: initialData.subject || 1,
        type: initialData.type || "Theory",
        duration_minutes: initialData.duration_minutes || 0,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        subject: 1,
        type: "Theory",
        duration_minutes: 0,
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
    mutationFn: (data: CourseFormData) =>
      mode === "create"
        ? createCourse(data)
        : editCourse(initialData!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      onClose();
      showSuccess(`Course ${mode==="create" ? 'created' : 'edited'} successfully!`);
    },
    onError: (error) => {
      console.error("Failed to save course:", error);
      showError(`${error}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    field: keyof CourseFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create New Course" : "Edit Course"}
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
          placeholder="Enter course title"
          classNames={{
            input:
              "dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:border-blue-500",
            label: "dark:text-gray-200",
          }}
        />

        <TextInput
          required
          label="Type"
          value={formData.type}
          onChange={(e) => handleChange("type", e.target.value)}
          placeholder="Enter course type(Theory, Practical, Core)"
          classNames={{
            input:
              "dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:border-blue-500",
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
          placeholder="Enter course description"
          minRows={3}
          classNames={{
            input:
              "dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:border-blue-500",
            label: "dark:text-gray-200",
          }}
        />

        <NumberInput
          required
          label="Total Duration"
          value={formData.duration_minutes}
          onChange={(value) => handleChange("duration_minutes", Number(value))}
          min={0}
          max={100}
          placeholder="Enter maximum score"
          classNames={{
            input: "dark:bg-gray-700 dark:text-white dark:border-gray-600",
            label: "dark:text-gray-200",
            control: "dark:border-gray-600 dark:hover:bg-gray-600",
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
            {mode === "create" ? "Create Course" : "Save Changes"}
          </Button>
        </div>

        {mutation.isError && (
          <div className="mt-2 text-red-500 dark:text-red-400 text-sm">
            Failed to {mode === "create" ? "create" : "update"} course. Please
            try again.
          </div>
        )}
      </form>
    </Modal>
  );
};
