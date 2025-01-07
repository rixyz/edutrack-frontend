import { Alert, Button, Input } from "@mantine/core";
import React, { useState } from "react";

import { isAxiosError } from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthService } from "../services/auth.service";

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { uid: uidb64 } = useParams<{ uid: string }>();
  const { token } = useParams<{ token: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match");
      return;
    }

    setStatus("loading");
    try {
      if (!uidb64 || !token) {
        throw new Error("Invalid reset link");
      }
      await AuthService.confirmResetPassword(
        uidb64,
        token,
        password,
        confirmPassword
      );
      setStatus("success");
      setMessage("Password has been reset successfully");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.data.errors) {
        setMessage(
          error.response?.data.errors[0]["password"] ||
            "Failed to reset password"
        );
      } else if (isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || "Failed to reset password");
      } else {
        setMessage("Failed to reset password. Please try again.");
      }
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Your Password
        </h2>

        {status !== "idle" && (
          <Alert
            className={`mb-4 ${
              status === "success"
                ? "bg-green-50"
                : status === "error"
                ? "bg-red-50"
                : "bg-blue-50"
            }`}
          >
            <div>{message}</div>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              New Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full space-y-3"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Resetting..." : "Reset Password"}
          </Button>
          <Link
            to={"/login"}
            className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 
                           dark:hover:text-blue-300 text-center transition-colors duration-200"
          >
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
