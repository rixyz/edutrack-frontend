import { ClipboardCheck, AlertCircle } from "lucide-react";
import { Assignment } from "./types";

export const getAssignmentStatus = (assignment: Assignment) => {
  const hasSubmission =
    assignment.submission && assignment.submission.length > 0;
  const latestSubmission = hasSubmission ? assignment.submission[0] : null;

  if (latestSubmission?.score) {
    return {
      status: `${Math.floor(latestSubmission.score)}/${Math.floor(assignment.max_score)}`,
      statusColor: "green",
      icon: <ClipboardCheck size={20} className="text-green-600" />,
      isSubmitted: true,
    };
  }

  if (hasSubmission) {
    return {
      status: "Submitted",
      statusColor: "blue",
      icon: <ClipboardCheck size={20} className="text-blue-600" />,
      isSubmitted: true,
    };
  }

  const now = new Date();
  const dueDate = new Date(assignment.due_date);

  if (now > dueDate) {
    return {
      status: "Overdue",
      statusColor: "red",
      icon: <AlertCircle size={20} className="text-red-600" />,
      isSubmitted: false,
    };
  }

  return {
    status: "Not Started",
    statusColor: "gray",
    icon: <AlertCircle size={20} className="text-gray-600" />,
    isSubmitted: false,
  };
};
