"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();

    return (
        <header className="bg-background py-6 border-b-[0.5px] border-brown-500/20">
            <nav className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center relative">
                    <Link
                        href="/"
                        className="text-2xl font-extrabold tracking-wide text-navy-600 font-gtwpro"
                    >
                        PLUGGED<span className="text-brown-500">IN</span>
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center space-x-8 ml-auto text-sm font-medium">
                        <Link
                            href="/browse"
                            className="text-navy-500 hover:text-navy-600 duration-300 ease-in-out transition-colors font-gtwpro text-sm"
                        >
                            Browse Businesses
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-navy-500 hover:text-navy-600 duration-300 ease-in-out transition-colors font-gtwpro text-sm"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/list-business"
                                    className="text-navy-500 hover:text-navy-600 duration-300 ease-in-out transition-colors font-gtwpro text-sm"
                                >
                                    List Your Business
                                </Link>
                                <button
                                    onClick={signOut}
                                    className="px-7 py-3 rounded-[12px] transition-all duration-300 ease-in-out font-gtwpro text-sm border-[1.2px] cursor-pointer border-navy-600 text-navy-600 hover:bg-navy-600 hover:text-cream-50"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-navy-500 hover:text-navy-600 duration-300 ease-in-out transition-colors font-gtwpro text-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-7 py-3 rounded-[12px] transition-all duration-300 ease-in-out font-gtwpro text-sm border-[1.2px] cursor-pointer border-navy-600 text-navy-600 hover:bg-navy-600 hover:text-cream-50"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden text-navy-700 ml-auto"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </nav>
            <nav>
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-brown-200 bg-cream-50 px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col py-4 space-y-3">
                            <Link
                                href="/browse"
                                className="text-navy-500 hover:text-navy-600 transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Browse Businesses
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-navy-500 hover:text-navy-600 transition-colors py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/list-business"
                                        className="text-navy-500 hover:text-navy-600 transition-colors py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        List Your Business
                                    </Link>
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="px-4 py-2 border border-navy-700 text-navy-700 rounded-md hover:bg-navy-700 hover:text-white transition-all text-left"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-navy-700 hover:text-navy-900 transition-colors py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="px-4 py-2 border border-navy-700 text-navy-700 rounded-md hover:bg-navy-700 hover:text-white transition-all text-left"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
