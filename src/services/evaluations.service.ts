import api from "./api";

import {
  ApiResponse,
  StudentPredictions,
  StudentResults,
  SubjectPerformanceData,
} from "../types";

export const fetchStudentResult = async (
  studentId: number | null
): Promise<ApiResponse<StudentResults>> => {
  const response = await api.get<ApiResponse<StudentResults>>(
    `/result/${studentId}/`
  );
  return response.data;
};

export const getStudentPrediction = async (
  studentId: number | null
): Promise<ApiResponse<StudentPredictions>> => {
  const response = await api.get<ApiResponse<StudentPredictions>>(
    `/predictions/${studentId}/subject/`
  );
  return response.data;
};

export const getStudentPredictionList = async (): Promise<
  ApiResponse<SubjectPerformanceData>
> => {
  const response = await api.get<ApiResponse<SubjectPerformanceData>>(
    `/predictions/teacher/`
  );
  return response.data;
};
