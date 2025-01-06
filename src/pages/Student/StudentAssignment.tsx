import { Badge, Button, Card, Modal, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  ArrowRightIcon,
  CalendarClock,
  ClipboardCheck,
} from "lucide-react";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ErrorState, LoadingGrid } from "../../components/LoadingAndError";
import { fetchAssignments } from "../../services/academic.service";
import { Assignment } from "../../types";
import PageHeader from "../../components/PageHeader";
import { getAssignmentStatus } from "../../utils";


const AssignmentCard: React.FC<{ assignment: Assignment }> = ({
  assignment,
}) => {
  const { status, statusColor, icon } = getAssignmentStatus(assignment);

  const formattedDueDate = new Date(assignment.due_date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Link to={`/student/assignment/${assignment.id}`}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        className="w-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-l-4 bg-white dark:bg-gray-800 dark:border-opacity-50"
        style={{ borderColor: statusColor }}
      >
        <div className="flex justify-between items-center mb-3">
          <Text className="font-bold text-lg text-gray-800 dark:text-white truncate max-w-[70%]">
            {assignment.title}
          </Text>
          <Tooltip label={status}>
            <Badge
              color={statusColor}
              variant="light"
              leftSection={icon}
              className="font-medium dark:bg-opacity-20"
            >
              {status}
            </Badge>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <CalendarClock
              size={16}
              className="mr-2 text-gray-500 dark:text-gray-400"
            />
            <Text size="sm">Due: {formattedDueDate}</Text>
          </div>

          <Text size="sm" className="text-gray-500 dark:text-gray-400">
            {assignment.subject_data.name}
          </Text>
        </div>
      </Card>
    </Link>
  );
};

const AssignmentsSection: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const {
    isPending,
    isError,
    data: response,
    error,
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

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (isError) {
    return (
      <ErrorState
        title={
          isAxiosError(error) && error.response?.data.error
            ? error.response?.data.error
            : "Error while fetching Assignments"
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
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Assignments Left to Submit"
          action={
            response.data.length > 0 && (
              <Button onClick={open}>
                View All Assignments
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            )
          }
        />

        {leftToSubmitAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {leftToSubmitAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
            <ClipboardCheck size={48} className="mx-auto text-green-600 mb-4" />
            <Text className="text-xl text-gray-700 dark:text-gray-200">
              Great job! All assignments are submitted.
            </Text>
          </div>
        )}

        <Modal
          opened={opened}
          onClose={close}
          title="All Assignments"
          size="xl"
          classNames={{
            header:
              "dark:bg-gray-800 dark:text-white border-b dark:border-gray-700",
            body: "dark:bg-gray-800",
            close: "dark:text-gray-400 dark:hover:text-white",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 p-3">
            {response.data.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AssignmentsSection;
