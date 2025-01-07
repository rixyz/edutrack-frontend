import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorState, LoadingGrid } from "../components/LoadingAndError";
import { API_URL } from "../services/api";
import { AuthService } from "../services/auth.service";
import { ChatAPI } from "../services/chat.service";

interface User {
  id: number;
  first_name: string;
}

interface Message {
  id?: number;
  sender: number;
  receiver_id: number;
  content: string;
  created_at?: string;
}

const SelfChatIndicator = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
    <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 mb-4">
      <MessageCircle size={32} className="text-blue-500 dark:text-blue-300" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
      This is your personal space
    </h3>
    <p className="text-gray-600 dark:text-gray-400 text-center">
      You can use this chat to draft messages or save notes to yourself
    </p>
  </div>
);

const ChatRoom: React.FC = () => {
  const { receiverID } = useParams<{ receiverID: string }>();
  const receiverId = parseInt(receiverID || "0", 10);
  const senderId = AuthService.getCurrentUserId();

  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const queryClient = useQueryClient();

  const {
    data: chatData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["chat"],
    queryFn: () =>
      Promise.all([
        ChatAPI.fetchMessages(receiverId),
        ChatAPI.fetchReceiverDetails(receiverId),
      ]),
    staleTime: 1000 * 60 * 5,
    enabled: receiverId > 0,
  });

  const [messages, receiverData] = chatData || [[], null];

  const receiver = receiverData?.user;

  useEffect(() => {
    if (receiverId <= 0) return;

    const newSocket = ChatAPI.createWebSocket(receiverId);

    newSocket.onopen = () => {
      console.info("WebSocket connection established");
    };

    newSocket.onmessage = (event) => {
      try {
        const data: Message = JSON.parse(event.data);

        queryClient.setQueryData(
          ["chat"],
          (oldData: [Message[], User | null] | undefined) => {
            if (!oldData) return [[data], null];
            const [oldMessages, receiver] = oldData;
            return [[...oldMessages, data], receiver];
          }
        );
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onclose = (event) => {
      console.info("WebSocket connection closed:", event.code, event.reason);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [receiverId, queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          message: newMessage,
        })
      );
      setNewMessage("");
    }
  };

  if (receiverId <= 0) {
    return <div className="p-4 text-red-500">Invalid Receiver ID</div>;
  }

  if (isPending) {
    return <LoadingGrid variant="full" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error while fetching Messages"
        message={error.message}
        error={error}
        variant="full"
      />
    );
  }

  if (!receiver) {
    return (
      <ErrorState
        title={"Error while fetching Messages"}
        message="No receiver"
        variant="full"
      />
    );
  }
  return (
    <div className="min-h-screen p-6 transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-gray-50">
      <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden">
        <div className="bg-blue-500 dark:bg-blue-800 text-white p-4 flex items-center shadow-md">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img
              src={`http://${API_URL}${receiver.profile_picture}`}
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold px-3">
            {`${receiver.first_name} ${receiver.last_name}`}{" "}
            {receiverId === senderId ? "(You)" : ""}
          </h2>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
          {receiverId === senderId && <SelfChatIndicator />}

          {messages.map((message) => {
            const formattedDate = new Date(message.created_at).toLocaleString(
              "en-US",
              {
                dateStyle: "short",
                timeStyle: "short",
              }
            );

            return (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === senderId ? "justify-end" : "justify-start"
                } transition-all duration-300`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-xl shadow-sm relative ${
                    message.sender === senderId
                      ? "bg-blue-500 dark:bg-blue-700 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border dark:border-gray-600"
                  }`}
                >
                  <div className="break-words">{message.content}</div>
                  <div
                    className={`text-xs mt-1 text-right ${
                      message.sender === senderId
                        ? "text-gray-200 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-300"
                    }`}
                  >
                    {formattedDate}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="bg-gray-100 dark:bg-gray-800 p-4 flex border-t dark:border-gray-700"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-3 rounded-l-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-500 dark:bg-blue-700 text-white px-5 py-3 rounded-r-xl hover:bg-blue-600 dark:hover:bg-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
