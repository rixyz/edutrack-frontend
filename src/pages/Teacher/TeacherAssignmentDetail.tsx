import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  Edit,
  Eye,
  MessageSquare,
  Star,
  Trash2,
  User2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AssignmentModal } from "../../components/AssignmentModal";
import { ErrorState, LoadingGrid } from "../../components/LoadingAndError";
import {
  deleteAssignment,
  fetchAssignmentDetails,
  updateSubmissionGrade,
} from "../../services/academic.service";
import { API_URL } from "../../services/api";
import { StudentDetail, Submission } from "../../types";

import { FileCheck, FileX } from "lucide-react";
import React from "react";
import { showError, showSuccess } from "../../services/notification.service";
import { getStudentBySemester } from "../../services/user.service";

const StudentSubmissionList = ({
  students,
  submissions,
}: {
  students: StudentDetail[];
  submissions: Submission[];
}) => {
  const submissionMap = new Map(
    submissions?.map((submission) => [
      String(submission.student_id),
      submission,
    ])
  );

  const { submitted, notSubmitted } = students.reduce(
    (acc, student) => {
      const hasSubmitted = submissionMap.has(String(student.id));
      if (hasSubmitted) {
        acc.submitted.push(student);
      } else {
        acc.notSubmitted.push(student);
      }
      return acc;
    },
    { submitted: [] as StudentDetail[], notSubmitted: [] as StudentDetail[] }
  );

  return (
    <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Text size="lg" fw={600} className="dark:text-gray-200">
            Student Submissions
          </Text>
          <Group>
            <Badge
              variant="light"
              color="green"
              className="dark:bg-green-900/50 dark:text-green-200"
            >
              Submitted: {submitted.length}
            </Badge>
            <Badge
              variant="light"
              color="red"
              className="dark:bg-red-900/50 dark:text-red-200"
            >
              Not Submitted: {notSubmitted.length}
            </Badge>
          </Group>
        </div>

        {notSubmitted.length > 0 && (
          <div className="space-y-2">
            <Text size="sm" fw={500} className="dark:text-gray-300">
              Pending Submissions
            </Text>
            <div className="space-y-2">
              {notSubmitted.map((student) => (
                <Card
                  key={student.id}
                  withBorder
                  className="hover:shadow-md transition-shadow dark:bg-gray-700 dark:border-gray-600"
                >
                  <div className="flex justify-between items-center">
                    <Group>
                      <User2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <Text size="sm" fw={500} className="dark:text-gray-200">
                        {student.user.first_name} {student.user.last_name}
                      </Text>
                      <Text size="xs" c="dimmed" className="dark:text-gray-400">
                        {student.batch}
                      </Text>
                    </Group>
                    <Badge
                      leftSection={<FileX className="w-4 h-4" />}
                      variant="light"
                      color="red"
                      className="dark:bg-red-900/50 dark:text-red-200"
                    >
                      Not Submitted
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {submitted.length > 0 && (
          <div className="space-y-2">
            <Text size="sm" fw={500} className="dark:text-gray-300">
              Completed Submissions
            </Text>
            <div className="space-y-2">
              {submitted.map((student) => (
                <Card
                  key={student.id}
                  withBorder
                  className="hover:shadow-md transition-shadow dark:bg-gray-700 dark:border-gray-600"
                >
                  <div className="flex justify-between items-center">
                    <Group>
                      <User2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <Text size="sm" fw={500} className="dark:text-gray-200">
                        {student.user.first_name} {student.user.last_name}
                      </Text>
                      <Text size="xs" c="dimmed" className="dark:text-gray-400">
                        {student.batch}
                      </Text>
                    </Group>
                    <Badge
                      leftSection={<FileCheck className="w-4 h-4" />}
                      variant="light"
                      color="green"
                      className="dark:bg-green-900/50 dark:text-green-200"
                    >
                      Submitted
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {students.length === 0 && (
          <Text c="dimmed" ta="center" py="xl" className="dark:text-gray-400">
            No students found in this semester
          </Text>
        )}
      </div>
    </Card>
  );
};

interface GradeSubmissionParams {
  submissionId: number;
  score: number;
  feedback?: string;
}

const AssignmentDetails = () => {
  const { assignmentID } = useParams();
  const assignmentId = parseInt(assignmentID || "0", 10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const {
    data: response,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["assignment"],
    queryFn: () => fetchAssignmentDetails(assignmentId),
  });

  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: () =>
      response?.data?.subject_data?.semester
        ? getStudentBySemester(response.data.subject_data.semester)
        : Promise.reject("No semester data"),
    enabled: !!response?.data?.subject_data?.semester,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAssignment(assignmentId),
    onSuccess: () => {
      navigate("/teacher/assignment");
      showSuccess("Assignment removed!");
    },
    onError: (error) => {
      console.error(`Failed to remove assignment:`, error);
      showError(`${error}`);
    },
  });

  const gradeMutation = useMutation({
    mutationFn: (params: GradeSubmissionParams) =>
      updateSubmissionGrade(params.submissionId, {
        score: params.score,
        feedback: params.feedback,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment"] });
      setGradeModalOpen(false);
      setSelectedSubmission(null);
    },
    onError: (error) => {
      console.error(`Failed to grade assignment submission:`, error);
      showError(`${error}`);
    },
  });

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error while fetching Assignment Detail"
        message={error.message}
        error={error}
        variant="full"
      />
    );
  }

  const assignment = response.data;

  const GradeModal = () => {
    const [score, setScore] = useState<string>(
      selectedSubmission?.score?.toString() || ""
    );
    const [feedback, setFeedback] = useState<string>(
      selectedSubmission?.feedback || ""
    );
    const [error, setError] = useState<string>("");

    const handleSubmit = () => {
      if (!selectedSubmission) return;

      if (Number(score) > assignment.max_score) {
        setError(
          `Score cannot exceed the maximum score of ${assignment.max_score}`
        );
        return;
      }

      setError("");
      gradeMutation.mutate({
        submissionId: selectedSubmission.id,
        score: Number(score),
        feedback: feedback,
      });
    };

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newScore = e.target.value;
      setScore(newScore);

      if (Number(newScore) > assignment.max_score) {
        setError(
          `Score cannot exceed the maximum score of ${assignment.max_score}`
        );
      } else {
        setError("");
      }
    };

    return (
      <Modal
        opened={gradeModalOpen}
        onClose={() => {
          setGradeModalOpen(false);
          setSelectedSubmission(null);
          setError("");
        }}
        title="Grade Submission"
        size="lg"
        classNames={{
          header:
            "dark:bg-gray-800 dark:text-white border-b dark:border-gray-700",
          body: "dark:bg-gray-800",
          close: "dark:text-gray-400 dark:hover:text-white",
        }}
        overlayProps={{
          blur: 3,
          className: "dark:bg-gray-900/80",
        }}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <TextInput
              label="Score"
              type="number"
              value={score}
              onChange={handleScoreChange}
              max={assignment.max_score}
              min={0}
              required
              error={error}
              classNames={{
                input: "dark:bg-gray-700 dark:text-white dark:border-gray-600",
                label: "dark:text-gray-200",
                error: "dark:text-red-400",
              }}
            />
          </div>
          <Textarea
            label="Feedback (Optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            minRows={3}
            placeholder="Provide feedback for the student..."
            classNames={{
              input: "dark:bg-gray-700 dark:text-white dark:border-gray-600",
              label: "dark:text-gray-200",
            }}
          />
          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={() => {
                setGradeModalOpen(false);
                setError("");
              }}
              className="dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={gradeMutation.isPending}
              className="dark:bg-blue-600 dark:hover:bg-blue-700"
              disabled={!!error}
            >
              Save Grade
            </Button>
          </Group>
        </div>
      </Modal>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Text size="xs" c="dimmed" className="mb-1 dark:text-gray-400">
                {assignment.subject_data.name}
              </Text>
              <Text size="xl" fw={700} className="dark:text-gray-200">
                {assignment.title}
              </Text>
            </div>
            <Group>
              <Button
                variant="light"
                leftSection={<Edit className="w-4 h-4" />}
                onClick={() => setEditModalOpen(true)}
                className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Edit
              </Button>
              <Button
                variant="light"
                color="red"
                leftSection={<Trash2 className="w-4 h-4" />}
                onClick={() => setDeleteModalOpen(true)}
                className="dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900"
              >
                Delete
              </Button>
            </Group>
          </div>

          <div className="space-y-4">
            <Text className="text-gray-600 dark:text-gray-400">
              {assignment.description}
            </Text>

            <div className="flex flex-wrap gap-4">
              <Badge
                leftSection={<Calendar className="w-4 h-4" />}
                variant="light"
                className="dark:bg-gray-700 dark:text-gray-200"
              >
                Created: {new Date(assignment.created_at).toLocaleDateString()}
              </Badge>
              <Badge
                leftSection={<Clock className="w-4 h-4" />}
                variant="light"
                color="yellow"
                className="dark:bg-yellow-900/50 dark:text-yellow-200"
              >
                Due: {new Date(assignment.due_date).toLocaleDateString()}
              </Badge>
              <Badge
                leftSection={<Star className="w-4 h-4" />}
                variant="light"
                color="blue"
                className="dark:bg-blue-900/50 dark:text-blue-200"
              >
                Max Score: {Math.floor(assignment.max_score)}
              </Badge>
            </div>
          </div>
        </Card>

        {assignment?.submission ? (
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <Text size="lg" fw={600} className="mb-4 dark:text-gray-200">
              Submissions ({assignment.submission.length})
            </Text>

            <div className="space-y-4">
              {assignment.submission.map((submission) => (
                <Card
                  key={submission.id}
                  withBorder
                  className="hover:shadow-md transition-shadow dark:bg-gray-700 dark:border-gray-600"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Group>
                        <User2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        <Text size="sm" fw={500} className="dark:text-gray-200">
                          {submission.student_name}
                        </Text>
                        <Text
                          size="xs"
                          c="dimmed"
                          className="dark:text-gray-400"
                        >
                          {new Date(submission.created_at).toLocaleString()}
                        </Text>
                      </Group>

                      {submission.score && (
                        <Group>
                          <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                          <Text size="sm" className="dark:text-gray-200">
                            Score: {Math.floor(submission.score)}/
                            {Math.floor(assignment.max_score)}
                          </Text>
                        </Group>
                      )}

                      {submission.feedback && (
                        <Group>
                          <MessageSquare className="w-4 h-4 text-green-500 dark:text-green-400" />
                          <Text size="sm" className="dark:text-gray-300">
                            {submission.feedback}
                          </Text>
                        </Group>
                      )}
                    </div>

                    <Group>
                      <Button
                        variant="light"
                        size="sm"
                        component="a"
                        href={`http://${API_URL}${submission.submission_file}`}
                        target="_blank"
                        leftSection={<Eye className="w-4 h-4" />}
                        className="dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                      >
                        View
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setGradeModalOpen(true);
                        }}
                        className="dark:bg-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-900"
                      >
                        {submission.score ? "Update Grade" : "Grade"}
                      </Button>
                    </Group>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        ) : (
          <Text c="dimmed" ta="center" py="xl" className="dark:text-gray-400">
            No submissions yet
          </Text>
        )}

        {studentsData && (
          <StudentSubmissionList
            students={studentsData}
            submissions={assignment.submission}
          />
        )}

        <AssignmentModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          initialData={assignment}
          mode="edit"
        />

        <Modal
          opened={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Assignment"
          centered
          classNames={{
            header:
              "dark:bg-gray-800 dark:text-white border-b dark:border-gray-700",
            body: "dark:bg-gray-800",
            close: "dark:text-gray-400 dark:hover:text-white",
          }}
          overlayProps={{
            blur: 3,
            className: "dark:bg-gray-900/80",
          }}
        >
          <Text size="sm" mb="lg" className="dark:text-gray-200">
            Are you sure you want to delete this assignment? This action cannot
            be undone.
          </Text>
          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() => setDeleteModalOpen(false)}
              className="dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              color="red"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
              className="dark:bg-red-900 dark:hover:bg-red-800"
            >
              Delete
            </Button>
          </Group>
        </Modal>

        <GradeModal />
      </div>
    </div>
  );
};

export default AssignmentDetails;
