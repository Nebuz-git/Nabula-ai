"use client";

import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


export default function SigninPage() {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const supabase = createClient();
    const router = useRouter()

    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });
        if (error) {
            setMessage("Error signing in with Google");
        }
    };

     async function HandleAuth(event: React.FormEvent){
        event.preventDefault();
        try { 
            if (isSignup) {
               const { error } = await supabase.auth.signUp({ email, password });
               if (error) throw error;
                setMessage("Sign-up successful! Please check your email to confirm your account.");
            } else {
                await supabase.auth.signInWithPassword({ email, password });
                router.push('/dashboard')
            }
        }
        catch (error) {
            console.error("Error during authentication:", error);
        }

    }
  return (
<div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <Card className="w-full max-w-lg bg-neutral-800 border-neutral-700 shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-white">
            Nabula.Ai
          </CardTitle>
          <CardDescription className="text-neutral-400">
            {isSignup ? "Create a new account" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={HandleAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-neutral-900 border-neutral-700 text-white "
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
              />
            </div>

            {message && (
              <p className="text-sm font-medium text-green-500">{message}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="flex items-center my-6">
            <Separator className="flex-1 bg-neutral-700" />
            <span className="mx-2 text-sm text-neutral-400">or</span>
            <Separator className="flex-1 bg-neutral-700" />
          </div>

          <Button
            className="w-full border-neutral-600 text-white bg-blue-800 hover:bg-blue-700"
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={() => setIsSignup((prev) => !prev)}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            {isSignup
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
