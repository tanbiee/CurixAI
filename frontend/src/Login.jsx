import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { MyContext } from './MyContext';
import './Login.css';

export default function Login() {
    const { setUser } = useContext(MyContext);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3030";

    const handleSuccess = async (response) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ credential: response.credential })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                localStorage.setItem("curixai_user", JSON.stringify(data.user));
            } else {
                alert("Login Error: " + data.error);
            }
        } catch (error) {
            console.error("Login verification failed:", error);
            alert("Network error. Please try again.");
        }
    };

    const handleError = () => {
        console.error("Google Login Failed");
        alert("Google Login Failed. Please try again.");
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Welcome to CurixAI</h1>
                <p>Please log in to start chatting</p>
                <div className="google-btn">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        theme="filled_black"
                        shape="pill"
                    />
                </div>
            </div>
        </div>
    );
}
