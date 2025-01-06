import api, { API_URL } from "./api";

import { ApiResponse, Message, MessageList, StudentDetail, TeacherDetail } from "../types";

export const ChatAPI = {
  async fetchAllMessages(): Promise<MessageList[]> {
    const response = await api.get<ApiResponse<MessageList[]>>(`/chat/`);
    return response.data.data;
  },

  async fetchMessages(receiverId: number): Promise<Message[]> {
    const response = await api.get<ApiResponse<Message[]>>(
      `/chat/${receiverId}/`
    );
    return response.data.data;
  },

  async fetchReceiverDetails(receiverId: number): Promise<TeacherDetail|StudentDetail> {
    const response = await api.get<ApiResponse<TeacherDetail|StudentDetail>>(
      `/users/${receiverId}/`
    );
    return response.data.data;
  },

  async sendMessage(receiverId: number, message: string): Promise<Message> {
    const response = await api.post<ApiResponse<Message>>(
      `/chat/${receiverId}/`,
      {
        content: message,
      }
    );
    return response.data.data;
  },

  createWebSocket(receiverId: number): WebSocket {
    const token = localStorage.getItem("accessToken");
    return new WebSocket(
      `ws://${API_URL}/ws/chat/${receiverId}?token=${token}`
    );
  },
};
