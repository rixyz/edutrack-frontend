import { Button, Card, Progress } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, Edit, Plus, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AssignmentModal } from "../../components/AssignmentModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { ErrorState, LoadingGrid } from "../../components/LoadingAndError";
import PageHeader from "../../components/PageHeader";
import {
  deleteAssignment,
  fetchAssignments,
} from "../../services/academic.service";
import { Assignment } from "../../types";

const AssignmentCard = ({
  assignment,
  onEdit,
  onDelete,
}: {
  assignment: Assignment & {
    stats: { submissionRate: number; totalSubmissions: number };
  };
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Link to={`/teacher/assignment/${assignment.id}`} className="block h-full">
    <Card className="flex flex-col h-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col h-full p-5">
        <div className="flex-grow space-y-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 capitalize">
            {assignment.title}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 capitalize">
            {assignment.subject_data.name}
          </div>
          <div className="w-16 h-0.5 bg-blue-500 mt-3"></div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <span className="line-clamp-1">
                {new Date(assignment.due_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>Score: {Math.floor(assignment.max_score)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-2 text-purple-500" />
              <span>Submissions: {assignment.stats.totalSubmissions}/30</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Submission Rate
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {assignment.stats.submissionRate.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={assignment.stats.submissionRate}
                className="h-2"
                color="blue"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button
            variant="subtle"
            size="sm"
            color="blue"
            onClick={(e) => {
              e.preventDefault();
              onEdit();
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="subtle"
            size="sm"
            color="red"
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  </Link>
);

const TeacherAssignment = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const {
    isPending,
    isError,
    data: response,
    error,
  } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => fetchAssignments("teacher"),
  });

  const assignmentsWithStats = useMemo(() => {
    if (!response?.data) return [];

    return response.data.map((assignment) => ({
      ...assignment,
      stats: {
        submissionRate: (assignment.submission.length / 30) * 100,
        totalSubmissions: assignment.submission.length,
      },
    }));
  }, [response]);

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error while fetching Assignments"
        message={error.message}
        error={error}
        variant="full"
      />
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Manage Assignments"
          action={
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Assignment
            </Button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignmentsWithStats.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onEdit={() => {
                setSelectedAssignment(assignment);
                setEditModalOpen(true);
              }}
              onDelete={() => {
                setSelectedAssignment(assignment);
                setDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>

        <AssignmentModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          mode="create"
        />
        <AssignmentModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedAssignment(null);
          }}
          initialData={selectedAssignment}
          mode="edit"
        />
        {selectedAssignment && (
          <DeleteConfirmationModal
            isOpen={deleteDialogOpen}
            onClose={() => {
              setDeleteDialogOpen(false);
              setSelectedAssignment(null);
            }}
            title="Delete Assignment"
            entityName="Assignment"
            deleteFn={deleteAssignment}
            queryKey={["assignments"]}
            itemId={selectedAssignment.id}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherAssignment;
