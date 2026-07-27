"use client";
import React, { useState } from "react";
import Link from "next/link";
import { User, Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    // 1. State Variables Setup
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(""); // Stores error messages
    const [showResetModal, setShowResetModal] = useState(false); // Controls the beautiful custom popup
    const router = useRouter();

    // 2. The Main Login Logic
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg(""); // Clear out any old errors

        // 3. Validation: Check if fields are empty
        if (!email || !password) {
            setErrorMsg("Please enter both email and password.");
            return;
        }

        // 4. Validation: Check if email is in a valid format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);

        // 5. Connecting to the Backend
        try {
            // NOTE: Make sure 'http://localhost:5000/login' matches your Flask backend URL
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // 6. Handling the Backend Response
            if (response.ok) {
                // If the backend says true/success
                // You can save a real user token here, or just stick to the dummy value to verify connection
                localStorage.setItem("safeBiteUser", data.token || "true");
                router.push("/"); // Send the user to the home page
            } else {
                // If the backend sends an error (e.g. 401 Unauthorized because wrong password)
                setErrorMsg(data.message || "Incorrect email or password");
            }

        } catch (err) {
            // 7. Handling Network/Server Errors
            console.error("Login fetch error:", err);
            setErrorMsg("Could not connect to the server. Is your Flask backend running?");
        } finally {
            setIsLoading(false); // Stop the loading spinner
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">

                {/* Header Section */}
                <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-20 transform -skew-y-6"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-white p-3 rounded-full mb-4 shadow-lg">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-blue-100">Sign in to SafeBite</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-8 space-y-6">

                    {/* 8. Display Error Message to User */}
                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg flex items-center text-sm">
                            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-gray-500"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-gray-500"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-400 cursor-pointer hover:text-gray-300">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded mr-2 focus:ring-blue-500 focus:ring-offset-gray-800" />
                                Remember me
                            </label>
                            <a 
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    if(!email) {
                                        setErrorMsg("Please type your email address above first, then click 'Forgot Password?'.");
                                    } else {
                                        setErrorMsg("");
                                        setShowResetModal(true); // Triggers the custom UI popup!
                                    }
                                }}
                                className="text-blue-400 hover:text-blue-300">Forgot Password?</a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-lg shadow-lg transform transition-all duration-200 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connecting System...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Sign In <ArrowRight className="ml-2 w-5 h-5" />
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Section */}
                <div className="bg-gray-750 p-4 text-center border-t border-gray-700 bg-gray-800/50">
                    <p className="text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Custom Beautiful Simulated Email Popup Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-gray-800 border border-blue-500/30 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/50">
                            <ShieldCheck className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Reset Link Sent!</h3>
                        <p className="text-gray-300 mb-6">
                            We've dispatched a secure password recovery link to:
                            <br/>
                            <span className="text-blue-400 font-semibold">{email}</span>
                        </p>
                        <button 
                            onClick={() => setShowResetModal(false)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg w-full transition border border-blue-400/50 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                            Back to Login
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
