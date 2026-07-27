"use client";
import React, { useState } from "react";
import Link from "next/link";
import { User, Lock, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!email || !password || !confirmPassword) {
            setErrorMsg("Please fill out all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("https://food-allergic-system.onrender.com/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMsg("Account created successfully! Redirecting to login...");
                // Wait 2 seconds before redirecting so they see the success message
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setErrorMsg(data.message || "Failed to create account.");
            }
        } catch (err) {
            setErrorMsg("Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                {/* Header */}
                <div className="bg-green-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-green-500 opacity-20 transform -skew-y-6"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-white p-3 rounded-full mb-4 shadow-lg">
                            <ShieldCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-green-100">Join SafeBite today</p>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8 space-y-6">
                    {/* Error Banner */}
                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg flex items-center text-sm">
                            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            {errorMsg}
                        </div>
                    )}

                    {/* Success Banner */}
                    {successMsg && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-lg flex items-center text-sm">
                            <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
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
                                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3 rounded-lg shadow-lg transform transition-all duration-200 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    Creating Account...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Sign Up <ArrowRight className="ml-2 w-5 h-5" />
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-gray-750 p-4 text-center border-t border-gray-700 bg-gray-800/50">
                    <p className="text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
