import {
    ApiResponse,
    StudentDetail,
    TeacherDetail,
    UserDetail,
} from "../types";
import api from "./api";

export const getUserDetails = async (): Promise<
  TeacherDetail | StudentDetail
> => {
  const response = await api.get<ApiResponse<TeacherDetail | StudentDetail>>(
    `/user/info/`
  );
  return response.data.data;
};

export const searchUsers = async (query: string): Promise<UserDetail[]> => {
  const response = await api.get<ApiResponse<UserDetail[]>>(
    `/users/search/?query=${query}`
  );
  return response.data.data;
};

export const getStudentBySemester = async (semester: number): Promise<StudentDetail[]> => {
  const response = await api.get<ApiResponse<StudentDetail[]>>(
    `/students/${semester}`
  );
  return response.data.data;
};
