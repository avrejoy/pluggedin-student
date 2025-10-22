"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Business {
    id: string;
    business_name: string;
    tagline: string;
    category_id: number;
    profile_image_url: string | null;
    created_at: string;
}

interface Post {
    id: string;
    business_id: string;
    title: string;
    image_url: string | null;
    created_at: string;
}

const categories = [
    { id: 1, name: "Beauty & Hair" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Food & Baking" },
    { id: 4, name: "Tutoring" },
    { id: 5, name: "Creative & Design" },
    { id: 6, name: "Nails" },
    { id: 7, name: "Resell & Marketplace" },
    { id: 8, name: "Other" },
];

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"businesses" | "posts">(
        "businesses"
    );

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        } else if (user) {
            fetchData();
        }
    }, [user, authLoading, router]);

    async function fetchData() {
        try {
            // Fetch user's businesses
            const { data: businessData, error: businessError } = await supabase
                .from("businesses")
                .select(
                    "id, business_name, tagline, category_id, profile_image_url, created_at"
                )
                .eq("user_id", user?.id)
                .order("created_at", { ascending: false });

            if (businessError) throw businessError;
            setBusinesses(businessData || []);

            // Fetch user's posts
            const { data: postData, error: postError } = await supabase
                .from("business_posts")
                .select("id, business_id, title, image_url, created_at")
                .eq("user_id", user?.id)
                .order("created_at", { ascending: false });

            if (postError) throw postError;
            setPosts(postData || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function deleteBusiness(businessId: string) {
        if (
            !confirm(
                "Are you sure you want to delete this business? This will also delete all associated posts."
            )
        ) {
            return;
        }

        try {
            const { error } = await supabase
                .from("businesses")
                .delete()
                .eq("id", businessId);

            if (error) throw error;

            setBusinesses(businesses.filter((b) => b.id !== businessId));
            setPosts(posts.filter((p) => p.business_id !== businessId));
            alert("Business deleted successfully");
        } catch (error) {
            console.error("Error deleting business:", error);
            alert("Failed to delete business");
        }
    }

    async function deletePost(postId: string) {
        if (!confirm("Delete this post?")) {
            return;
        }

        try {
            const { error } = await supabase
                .from("business_posts")
                .delete()
                .eq("id", postId);

            if (error) throw error;

            setPosts(posts.filter((p) => p.id !== postId));
            alert("Post deleted successfully");
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post");
        }
    }

    function getCategoryName(categoryId: number) {
        return categories.find((c) => c.id === categoryId)?.name || "Other";
    }

    if (authLoading || loading) {
        return (
            <div className="py-16 md:py-24 flex items-center justify-center">
                <div className="text-navy-600 text-lg font-gtwpro font-medium">
                    Loading...
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-gtwpro text-navy-600 font-semibold mb-2">
                        My Dashboard
                    </h1>
                    <p className="text-navy-500">
                        Manage your businesses and posts
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab("businesses")}
                        className={`pb-4 px-2 font-semibold transition-colors cursor-pointer font-gtwpro border-b-2 border-b-transparent ${
                            activeTab === "businesses"
                                ? "text-brown-500 border-b-2 border-brown-500!"
                                : "text-navy-500/70"
                        }`}
                    >
                        My Businesses ({businesses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={`pb-4 px-2 font-semibold transition-colors cursor-pointer font-gtwpro border-b-2 border-b-transparent ${
                            activeTab === "posts"
                                ? "text-brown-500 border-b-2 border-brown-500!"
                                : "text-navy-500/70"
                        }`}
                    >
                        My Posts ({posts.length})
                    </button>
                </div>

                {/* Businesses Tab */}
                {activeTab === "businesses" && (
                    <div>
                        {businesses.length === 0 ? (
                            <div className="text-center py-20 bg-cream-50 rounded-[25px]">
                                <h3 className="text-xl font-semibold text-navy-600 mb-4">
                                    No businesses yet
                                </h3>
                                <p className="text-navy-500 mb-6">
                                    Create your first business to get started
                                </p>
                                <Link
                                    href="/list-business"
                                    className="mt-2 inline-block px-9 py-3.5 font-medium text-background text-sm bg-navy-600 rounded-[12px] hover:scale-110 transition-all ease-in-out duration-300"
                                >
                                    Create Business
                                </Link>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {businesses.map((business) => (
                                    <div
                                        key={business.id}
                                        className="bg-cream-50 rounded-2xl border-2 border-brown-200 overflow-hidden hover:shadow-lg transition-all"
                                    >
                                        <div className="aspect-square bg-brown-200 flex items-center justify-center">
                                            {business.profile_image_url ? (
                                                <img
                                                    src={
                                                        business.profile_image_url
                                                    }
                                                    alt={business.business_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-6xl">
                                                    🏪
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="text-sm text-brown-500 mb-2">
                                                {getCategoryName(
                                                    business.category_id
                                                )}
                                            </div>
                                            <h3 className="text-xl font-semibold text-navy-600 mb-2">
                                                {business.business_name}
                                            </h3>
                                            {business.tagline && (
                                                <p className="text-navy-500 text-sm mb-4 line-clamp-2">
                                                    {business.tagline}
                                                </p>
                                            )}
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/business/${business.id}`}
                                                    className="flex-1 px-4 py-2 bg-cream-200 text-navy-600 rounded text-center hover:bg-cream-300 transition-colors text-sm font-medium"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/business/${business.id}/edit`}
                                                    className="flex-1 px-4 py-2 bg-navy-600 text-cream-50 rounded text-center hover:bg-navy-500 transition-colors text-sm font-medium"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        deleteBusiness(
                                                            business.id
                                                        )
                                                    }
                                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Posts Tab */}
                {activeTab === "posts" && (
                    <div>
                        {posts.length === 0 ? (
                            <div className="text-center py-20 bg-cream-50 rounded-2xl border-2 border-brown-200">
                                <h3 className="text-xl font-semibold text-navy-600 mb-4">
                                    No posts yet
                                </h3>
                                <p className="text-navy-500">
                                    Add posts to your businesses to showcase
                                    your work
                                </p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {posts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="group relative"
                                    >
                                        <div className="aspect-square bg-brown-200 rounded-lg overflow-hidden mb-2">
                                            {post.image_url ? (
                                                <img
                                                    src={post.image_url}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                                    📷
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-sm font-semibold text-navy-600 mb-2">
                                            {post.title}
                                        </h3>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/business/${post.business_id}`}
                                                className="flex-1 px-3 py-1 bg-cream-200 text-navy-600 rounded text-center hover:bg-cream-300 transition-colors text-xs font-medium"
                                            >
                                                View Business
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    deletePost(post.id)
                                                }
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
