import {
  ApiResponse,
  Assignment,
  AssignmentFormData,
  Course,
  Lesson,
  Submission,
} from "../types";
import api from "./api";

export const createAssignment = async (
  data: AssignmentFormData
): Promise<ApiResponse<Assignment>> => {
  const response = await api.post<ApiResponse<Assignment>>(
    "/assignment/teacher/",
    data
  );
  return response.data;
};

export const fetchAssignments = async (
  type: string
): Promise<ApiResponse<Assignment[]>> => {
  const response = await api.get<ApiResponse<Assignment[]>>(
    `/assignment/${type}`
  );
  return response.data;
};

export const fetchAssignmentDetails = async (
  assignmentId: number
): Promise<ApiResponse<Assignment>> => {
  const response = await api.get<ApiResponse<Assignment>>(
    `/assignment/${assignmentId}/`
  );
  return response.data;
};

export const editAssignment = async (
  assignmentId: number,
  data: AssignmentFormData
): Promise<ApiResponse<Assignment>> => {
  const response = await api.patch<ApiResponse<Assignment>>(
    `/assignment/${assignmentId}/`,
    data
  );
  return response.data;
};

export const deleteAssignment = async (
  assignmentId: number
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(
    `/assignment/${assignmentId}/`
  );
  return response.data;
};

export const submitAssignmentSubmission = async ({
  file,
  assignmentId,
}: {
  file: File;
  assignmentId: number;
}): Promise<ApiResponse<Submission>> => {
  const formData = new FormData();
  formData.append("submission_file", file);
  formData.append("assignment", assignmentId.toString());

  const response = await api.post<ApiResponse<Submission>>(
    "/assignment/submission/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateSubmissionGrade = async (
  submissionId: number,
  data: {
    score: number | string;
    feedback?: string;
  }
): Promise<ApiResponse<Submission>> => {
  const response = await api.patch<ApiResponse<Submission>>(
    `/assignment/submission/grade/${submissionId}/`,
    data
  );
  return response.data;
};

export const deleteSubmission = async (
  submissionId: number
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(
    `/assignment/submission/${submissionId}/`
  );
  return response.data;
};

export const createCourse = async (
  data: Partial<Course>
): Promise<ApiResponse<Course>> => {
  const response = await api.post<ApiResponse<Course>>(
    "/course/teacher/",
    data
  );
  return response.data;
};

export const fetchCourses = async (
  type: string
): Promise<ApiResponse<Course[]>> => {
  const response = await api.get<ApiResponse<Course[]>>(`/course/${type}`);
  return response.data;
};

export const fetchCourseDetails = async (
  courseId: number
): Promise<ApiResponse<Course>> => {
  const response = await api.get<ApiResponse<Course>>(`/course/${courseId}/`);
  return response.data;
};

export const editCourse = async (id: number, data: Partial<Course>) => {
  const response = await api.patch(`/course/${id}/`, data);
  return response.data;
};

export const deleteCourse = async (id: number) => {
  const response = await api.delete(`/course/${id}/`);
  return response.data;
};

export const createLesson = async (data: Partial<Lesson>) => {
  const response = await api.post("/lessons/", data);
  return response.data;
};

export const updateLesson = async (id: number, data: Partial<Lesson>) => {
  const response = await api.patch(`/api/lessons/${id}/`, data);
  return response.data;
};

export const deleteLesson = async (id: number) => {
  const response = await api.delete(`/api/lessons/${id}/`);
  return response.data;
};
