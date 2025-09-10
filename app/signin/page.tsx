"use client";

import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SigninPage() {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setMessage("");
        
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            });
            
            if (error) {
                setMessage(`Error signing in with Google: ${error.message}`);
            }
        } catch (error) {
            setMessage("An unexpected error occurred with Google sign-in");
            console.error("Google sign-in error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    async function HandleAuth(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(true);
        setMessage("");

        try { 
            if (isSignup) {
                const { data, error } = await supabase.auth.signUp({ 
                    email, 
                    password 
                });
                
                if (error) {
                    setMessage(`Sign-up error: ${error.message}`);
                } else {
                    setMessage("Sign-up successful! Please check your email to confirm your account.");
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ 
                    email, 
                    password 
                });
                
                if (error) {
                    setMessage(`Sign-in error: ${error.message}`);
                } else if (data.user) {
                    router.push('/dashboard');
                    router.refresh();
                } else {
                    setMessage("Sign-in failed. Please try again.");
                }
            }
        } catch (error: any) {
            console.error("Authentication error:", error);
            setMessage(`An unexpected error occurred: ${error.message || 'Please try again'}`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Column - Sign In Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            {isSignup ? "Create your account" : "Welcome back"}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {isSignup 
                                ? "Join Nabula.ai and unlock your second brain" 
                                : "Sign in to access your second brain hub"
                            }
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={HandleAuth} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete={isSignup ? "new-password" : "current-password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`text-sm font-medium ${
                                message.includes('error') || message.includes('Error') 
                                    ? 'text-red-600' 
                                    : 'text-green-600'
                            }`}>
                                {message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading 
                                ? (isSignup ? "Creating account..." : "Signing in...") 
                                : (isSignup ? "Create account" : "Sign in")
                            }
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            variant="outline"
                            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            {isLoading ? "Connecting..." : "Google"}
                        </Button>
                    </form>

                    {/* Toggle Sign In/Sign Up */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setMessage("");
                            }}
                            disabled={isLoading}
                            className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                        >
                            {isSignup 
                                ? "Already have an account? Sign in" 
                                : "Don't have an account? Sign up"
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column - Animated Logo/Branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 items-center justify-center relative overflow-hidden">
                {/* Background Pattern */}
                {/* <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-32 right-20 w-16 h-16 bg-indigo-200 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-200 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-32 right-32 w-8 h-8 bg-pink-200 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                </div> */}

                {/* Main Logo/Content */}
                <div className="relative z-10 text-center">
                    {/* Animated Brain Icon */}
                    <div className="mx-auto mb-8 relative">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                            <div className="text-white text-6xl animate-pulse">
                                N
                            </div>
                        </div>
                        {/* Floating particles around logo */}
                        {/* <div className="absolute -top-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-ping"></div>
                        <div className="absolute -top-2 -right-6 w-4 h-4 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.7s'}}></div>
                        <div className="absolute -bottom-4 -left-2 w-5 h-5 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
                        <div className="absolute -bottom-2 -right-4 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div> */}
                    </div>

                    {/* Brand Text */}
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Nabula.ai
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-md">
                        Your intelligent second brain that learns, adapts, and grows with you
                    </p>

                    {/* Feature highlights */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center text-gray-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                            <span className="text-lg">Smart Knowledge Management</span>
                        </div>
                        <div className="flex items-center justify-center text-gray-700">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                            <span className="text-lg">AI-Powered Insights</span>
                        </div>
                        <div className="flex items-center justify-center text-gray-700">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse" style={{animationDelay: '1s'}}></div>
                            <span className="text-lg">Seamless Organization</span>
                        </div>
                    </div>
                </div>

                {/* Animated background elements */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>
        </div>
    );
}