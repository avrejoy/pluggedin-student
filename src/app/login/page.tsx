"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomInput from "../components/form/CustomInput";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push("/browse");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-gtwpro tracking-tight font-semibold text-navy-600 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-navy-500 font-gtwpro font-normal tracking-tight">
                        Sign in to manage your business
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-[13px] text-red-700 font-gtwpro font-normal text-sm">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleLogin}
                    className="rounded-[25px] p-1 sm:p-5 md:p-8 sm:border-[1.3px] border-navy-500/10"
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
                            placeholder="•••••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-8 py-3.5 bg-navy-600 text-background rounded-[16px] font-medium font-gtwpro text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4 cursor-pointer"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="text-center text-navy-600 font-normal font-gtwpro text-sm mb-1">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-medium underline text-brown-400 hover:text-brown-500"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
