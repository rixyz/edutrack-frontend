import { useForm } from "@mantine/form";
import {
  AtSign,
  ChevronRight,
  GraduationCap,
  Loader2,
  Lock,
  PersonStanding,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";

import StudentLogin from "../assets/img/StudentLogin.svg";
import TeacherLogin from "../assets/img/TeacherLogin.svg";

import { Modal } from "@mantine/core";
import { AlertCircle, CheckCircle, Send, X } from "lucide-react";
import { isAxiosError } from "axios";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await AuthService.resetPasswordLink(email);
      setStatus("success");
      setMessage("Password reset link has been sent to your email");
      setTimeout(() => {
        onClose();
        setEmail("");
        setStatus("idle");
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Failed to send reset instructions. Please try again.");
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      classNames={{
        content: "rounded-xl bg-white dark:bg-gray-800 p-0 shadow-xl",
        header: "hidden",
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {status !== "idle" && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
              status === "success"
                ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : status === "error"
                ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            }`}
          >
            {status === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : status === "error" ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
            )}
            <p className="text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AtSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg
                     text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                <span>Send Reset Link</span>
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
    },
  });

  const handleSubmit = async (values: LoginForm) => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await AuthService.login(values);
      navigate(
        role === "student" ? "/student/dashboard" : "/teacher/dashboard"
      );
    } catch (error) {
      setErrorMsg(
        isAxiosError(error) && error.response?.data.error
          ? error.response?.data.error
          : "Authentication failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:flex flex-col items-center justify-center p-8">
            <img
              src={role === "student" ? StudentLogin : TeacherLogin}
              className="w-full max-w-md transition-all duration-300 "
              alt="Login illustration"
            />
            <h2 className="mt-8 text-2xl font-bold text-gray-700 dark:text-gray-200">
              Welcome to EduTrack
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
              Your gateway to interactive learning and teaching
            </p>
          </div>

          <div className="w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
                  {["student", "teacher"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r as "student" | "teacher")}
                      className={`
                        flex items-center px-4 py-2 rounded-lg text-sm font-medium
                        ${
                          role === r
                            ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                        }
                        transition-all duration-200
                      `}
                    >
                      {r === "student" ? (
                        <PersonStanding className="w-4 h-4 mr-2" />
                      ) : (
                        <GraduationCap className="w-4 h-4 mr-2" />
                      )}
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
                {role === "student" ? "Student Login" : "Teacher Login"}
              </h1>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
                  {errorMsg}
                </div>
              )}

              <form
                onSubmit={form.onSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AtSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...form.getInputProps("email")}
                      type="email"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  {form.errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {form.errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...form.getInputProps("password")}
                      type="password"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                    />
                  </div>
                  {form.errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {form.errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg
                           text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-blue-500 transition-colors duration-200"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 
                           dark:hover:text-blue-300 text-center transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default Login;
