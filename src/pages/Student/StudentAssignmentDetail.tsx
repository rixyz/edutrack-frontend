import { Text } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorState, LoadingGrid } from "../../components/LoadingAndError";
import {
  deleteSubmission,
  fetchAssignmentDetails,
  submitAssignmentSubmission,
} from "../../services/academic.service";
import { API_URL } from "../../services/api";
import { showError, showSuccess } from "../../services/notification.service";

const AssignmentSubmissionPage: React.FC = () => {
  const { assignmentID } = useParams<{ assignmentID: string }>();
  const assignmentId = parseInt(assignmentID || "0", 10);
  const queryClient = useQueryClient();

  const {
    data: response,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["assignment"],
    queryFn: () => fetchAssignmentDetails(assignmentId),
  });

  const assignment = response?.data;

  const existingSubmission = assignment?.submission?.[0];

  const submitMutation = useMutation({
    mutationFn: submitAssignmentSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment"] });
      showSuccess("Assignment submission submitted successfully!");
    },
    onError: (error) => {
      console.error(`Failed to submit assignment sbmission:`, error);
      showError(`${error}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment"] });
      setSelectedFile(null);
      showSuccess("Assignment submission removed!");
    },
    onError: (error) => {
      console.error(`Failed to remove assignment submission:`, error);
      showError(`${error}`);
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = () => {
    if (selectedFile && assignment) {
      submitMutation.mutate({
        file: selectedFile,
        assignmentId: assignment.id,
      });
    }
  };

  const handleDeleteSubmission = () => {
    if (existingSubmission) {
      deleteMutation.mutate(existingSubmission.id);
    }
  };

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

  if (!assignment) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 dark:bg-gray-900">
        <div className="flex items-center bg-red-50 dark:bg-red-900/20 p-4 rounded-xl shadow-md">
          <AlertTriangle className="mr-3 text-red-500 dark:text-red-400" />
          <Text className="text-red-600 dark:text-red-300">
            Assignment not found
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-gray-50">
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300">
          <div className="bg-blue-600 dark:bg-blue-700 text-white p-6">
            <h1 className="text-2xl font-bold flex items-center">
              <BookOpen className="mr-3" />
              Assignment Submission
            </h1>
          </div>

          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              {assignment.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {assignment.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Calendar
                  className="mr-2 text-blue-500 dark:text-blue-400"
                  size={20}
                />
                <span>
                  Due Date: {new Date(assignment.due_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <FileText
                  className="mr-2 text-green-500 dark:text-green-400"
                  size={20}
                />
                <span>Subject: {assignment.subject_data.name}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {(submitMutation.isError || deleteMutation.isError) && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4">
                {submitMutation.isError
                  ? "Submission failed. Please try again."
                  : "Deletion failed. Please try again."}
              </div>
            )}

            {existingSubmission && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle
                      className="text-green-600 dark:text-green-400 mr-3"
                      size={24}
                    />
                    <span className="text-green-800 dark:text-green-300">
                      Submitted:{" "}
                      <Link
                        to={`http://${API_URL}${existingSubmission.submission_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {existingSubmission.submission_file?.split("/").pop()}
                      </Link>
                    </span>
                  </div>
                  {existingSubmission.score ? (
                    <div className="bg-blue-500 dark:bg-blue-600 p-2 rounded-full text-white font-semibold">
                      {Math.floor(existingSubmission.score)}/
                      {Math.floor(assignment.max_score)}
                    </div>
                  ) : (
                    <button
                      onClick={handleDeleteSubmission}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center transition-colors"
                    >
                      <Trash2 className="mr-2" size={20} />
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {!existingSubmission && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload
                      className="text-blue-500 dark:text-blue-400 mb-3"
                      size={48}
                    />
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedFile
                        ? `Selected: ${selectedFile.name}`
                        : "Click to upload assignment file"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      PDF, DOC, DOCX, TXT (max 10MB)
                    </p>
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!selectedFile || submitMutation.isPending}
                  className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg 
                      hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors 
                      disabled:bg-gray-400 dark:disabled:bg-gray-600 
                      flex items-center justify-center"
                >
                  {submitMutation.isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Upload className="mr-2" size={20} />
                      Submit Assignment
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissionPage;
