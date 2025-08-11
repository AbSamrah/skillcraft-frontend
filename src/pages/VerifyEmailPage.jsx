import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/auth";
import useAuth from "../hooks/useAuth";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your email, please wait..."
  );

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    const handleVerification = async () => {
      if (!email || !token) {
        return;
      }

      try {
        const response = await verifyEmail(email, token);
        setStatus("success");
        setMessage(
          response.message ||
            "Email verified successfully! You are now logged in."
        );

        if (response.token) {
          login(response.token);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.message ||
            "Verification failed. The link may be invalid or expired."
        );
      }
    };

    handleVerification();
  }, [email, token, login, navigate]);

  const getStatusIcon = () => {
    if (status === "success") {
      return <h1 className="display-1 text-success">✓</h1>;
    }
    if (status === "error") {
      return <h1 className="display-1 text-danger">✗</h1>;
    }
    return (
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}>
      <div className="col-md-6 col-lg-5">
        <Card>
          <div className="text-center p-3">
            {getStatusIcon()}
            <h3 className="card-title mt-4">
              {status === "success"
                ? "Verification Successful"
                : status === "error"
                ? "Verification Failed"
                : "Verifying Email"}
            </h3>
            <p className="lead text-muted mt-2">{message}</p>
            {status !== "verifying" && (
              <Link to={status === "success" ? "/profile" : "/signup"}>
                <Button variant="primary" className="mt-3">
                  {status === "success"
                    ? "Go to your profile"
                    : "Return to Sign Up"}
                </Button>
              </Link>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
