"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomInput from "../components/form/CustomInput";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            alert(
                "Account created! Please check your email to verify your account."
            );
            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-gtwpro font-semibold text-navy-600 mb-2">
                        Create Account
                    </h1>
                    <p className="text-navy-500 font-gtwpro font-normal">
                        Join PluggedIn and list your business
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSignup}
                    className="rounded-[25px] p-2 sm:p-5 md:p-8 border-[1.3px] border-navy-500/10"
                >
                    <div className="mb-6">
                        <CustomInput
                            type="email"
                            value={email}
                            setValue={(e) => setEmail(e.target.value)}
                            label="Email"
                            placeholder="your.email@university.edu"
                        />
                    </div>

                    <div className="mb-6">
                        <CustomInput
                            type="password"
                            value={password}
                            setValue={(e) => setPassword(e.target.value)}
                            label="Password"
                            placeholder="At least 6 characters"
                        />
                    </div>

                    <div className="mb-6">
                        <CustomInput
                            type="password"
                            value={confirmPassword}
                            setValue={(e) => setConfirmPassword(e.target.value)}
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-8 py-3.5 bg-navy-600 text-background rounded-[16px] font-medium font-gtwpro text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4 cursor-pointer"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>

                    <p className="text-center text-navy-600 font-normal font-gtwpro text-sm mb-1">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium underline text-brown-400 hover:text-brown-500"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
