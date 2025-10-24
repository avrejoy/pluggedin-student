"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

interface Business {
    id: string;
    name: string;
    business_name: string;
    tagline: string;
    description: string;
    category_id: number;
    contact_email: string;
    contact_phone: string | null;
    instagram_handle: string | null;
    website_url: string | null;
    profile_image_url: string | null;
    is_verified: boolean;
    user_id: string;
}

interface Post {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
}

interface Review {
    id: number;
    reviewer_name: string;
    rating: number;
    comment: string | null;
    created_at: string;
    user_id: string;
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

export default function BusinessProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [business, setBusiness] = useState<Business | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: "",
        reviewer_name: "",
    });
    const [loading, setLoading] = useState(true);

    const isOwner = user && business && user.id === business.user_id;
    const userReview = reviews.find((r) => r.user_id === user?.id);
    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              ).toFixed(1)
            : null;

    useEffect(() => {
        if (params.id) {
            fetchBusiness();
            fetchPosts();
            fetchReviews();
        }
    }, [params.id]);

    async function fetchBusiness() {
        try {
            const { data, error } = await supabase
                .from("businesses")
                .select("*")
                .eq("id", params.id)
                .single();
            if (error) throw error;
            setBusiness(data);
        } catch (error) {
            console.error("Error fetching business:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchPosts() {
        try {
            const { data, error } = await supabase
                .from("business_posts")
                .select("*")
                .eq("business_id", params.id)
                .order("created_at", { ascending: false });
            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    async function fetchReviews() {
        try {
            const { data, error } = await supabase
                .from("reviews")
                .select("*")
                .eq("business_id", params.id)
                .order("created_at", { ascending: false });
            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    }

    async function handleReviewSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) {
            alert("Please log in to leave a review");
            router.push("/login");
            return;
        }
        try {
            const { error } = await supabase.from("reviews").insert([
                {
                    business_id: parseInt(params.id as string),
                    user_id: user.id,
                    reviewer_name: reviewForm.reviewer_name,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment,
                },
            ]);
            if (error) throw error;
            alert("Review submitted!");
            setShowReviewForm(false);
            setReviewForm({ rating: 5, comment: "", reviewer_name: "" });
            fetchReviews();
        } catch (error: any) {
            if (error.code === "23505") {
                alert("You already reviewed this business");
            } else {
                alert("Failed to submit review");
            }
        }
    }

    async function deleteReview(reviewId: number) {
        if (!confirm("Delete your review?")) return;
        try {
            const { error } = await supabase
                .from("reviews")
                .delete()
                .eq("id", reviewId);
            if (error) throw error;
            setReviews(reviews.filter((r) => r.id !== reviewId));
        } catch (error) {
            alert("Failed to delete review");
        }
    }

    function getCategoryName(categoryId: number) {
        return categories.find((c) => c.id === categoryId)?.name || "Other";
    }
    function formatPhoneNumber(phone: string | null) {
  if (!phone) return "";
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
}

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-navy-600 text-lg font-gtwpro font-medium">
                    Loading...
                </div>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-navy-600 mb-4">
                        Business not found
                    </h2>
                    <Link
                        href="/browse"
                        className="text-brown-500 hover:text-brown-400 transition-colors"
                    >
                        Back to Browse
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <Link
                    href="/browse"
                    className="inline-flex items-center text-navy-500 hover:text-navy-600 mb-8 transition-colors"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Browse
                </Link>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* --- LEFT SIDEBAR --- */}
                    <div className="md:col-span-1">
                        <div className="bg-cream-50 rounded-2xl border-2 border-brown-200 overflow-hidden sticky top-8">
                            <div className="aspect-square bg-brown-200 flex items-center justify-center">
                                {business.profile_image_url ? (
                                    <img
                                        src={business.profile_image_url}
                                        alt={business.business_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-7xl">🏪</div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="text-sm text-brown-500 mb-2">
                                    {getCategoryName(business.category_id)}
                                </div>
                                {business.is_verified && (
                                    <div className="inline-flex items-center text-sm text-green-600 mb-2">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Verified Business
                                    </div>
                                )}
                                {averageRating && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-2xl text-yellow-500">
                                            ★
                                        </span>
                                        <span className="text-lg font-semibold text-navy-600">
                                            {averageRating}
                                        </span>
                                        <span className="text-sm text-navy-500">
                                            ({reviews.length})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- MAIN CONTENT --- */}
                    <div className="md:col-span-2">
                        {/* BUSINESS INFO SECTION */}
                        <div className="bg-cream-50 rounded-2xl p-6 border-2 border-brown-200 mb-6">
                            <h1 className="text-2xl font-bold text-navy-700 mb-2">
                                {business.business_name}
                            </h1>
                            {business.tagline && (
                                <p className="text-brown-500 italic mb-4">
                                    {business.tagline}
                                </p>
                            )}
                            <p className="text-navy-600 mb-4 whitespace-pre-line">
                                {business.description ||
                                    "No description provided."}
                            </p>

                            <div className="space-y-2 text-navy-600">
                                {business.contact_email && (
                                    <p>
                                        <strong>Email:</strong>{" "}
                                        <a
                                            href={`mailto:${business.contact_email}`}
                                            className="text-brown-600 hover:underline"
                                        >
                                            {business.contact_email}
                                        </a>
                                    </p>
                                )}

                                {business.contact_phone && (
                                    <p>
                                        <strong>Phone:</strong>{" "}
                                        {formatPhoneNumber(business.contact_phone)}
                                    </p>
                                )}

                                {business.website_url && (
                                    <p>
                                        <strong>Website:</strong>{" "}
                                        <a
                                            href={business.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-brown-600 hover:underline"
                                        >
                                            {business.website_url}
                                        </a>
                                    </p>
                                )}

                                {business.instagram_handle && (
                                    <p>
                                        <strong>Instagram:</strong>{" "}
                                        <a
                                            href={`https://instagram.com/${business.instagram_handle.replace(
                                                "@",
                                                ""
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-brown-600 hover:underline"
                                        >
                                            @{business.instagram_handle.replace(
                                                "@",
                                                ""
                                            )}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* REVIEWS SECTION */}
                        <div className="bg-cream-50 rounded-2xl p-6 border-2 border-brown-200 mt-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-navy-600">
                                    Reviews ({reviews.length})
                                </h2>
                                {user && !isOwner && !userReview && (
                                    <button
                                        onClick={() =>
                                            setShowReviewForm(!showReviewForm)
                                        }
                                        className="px-4 py-2 bg-navy-600 text-cream-50 rounded hover:bg-navy-500 transition-colors text-sm font-medium"
                                    >
                                        Write Review
                                    </button>
                                )}
                            </div>

                            {showReviewForm && (
                                <form
                                    onSubmit={handleReviewSubmit}
                                    className="mb-6 p-4 bg-cream-100 rounded-lg"
                                >
                                    <div className="mb-4">
                                        <label className="block text-navy-600 font-semibold mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={reviewForm.reviewer_name}
                                            onChange={(e) =>
                                                setReviewForm({
                                                    ...reviewForm,
                                                    reviewer_name:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded border-2 border-brown-200 bg-cream-50"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-navy-600 font-semibold mb-2">
                                            Rating *
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() =>
                                                        setReviewForm({
                                                            ...reviewForm,
                                                            rating: star,
                                                        })
                                                    }
                                                    className={`text-3xl ${
                                                        star <=
                                                        reviewForm.rating
                                                            ? "text-yellow-500"
                                                            : "text-gray-300"
                                                    }`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-navy-600 font-semibold mb-2">
                                            Comment
                                        </label>
                                        <textarea
                                            value={reviewForm.comment}
                                            onChange={(e) =>
                                                setReviewForm({
                                                    ...reviewForm,
                                                    comment: e.target.value,
                                                })
                                            }
                                            rows={3}
                                            className="w-full px-3 py-2 rounded border-2 border-brown-200 bg-cream-50 resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-navy-600 text-cream-50 rounded hover:bg-navy-500"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowReviewForm(false)
                                            }
                                            className="px-4 py-2 bg-cream-200 text-navy-600 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            {reviews.length === 0 ? (
                                <p className="text-navy-500 text-center py-8">
                                    No reviews yet
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="p-4 bg-cream-100 rounded-lg"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-semibold text-navy-600">
                                                        {
                                                            review.reviewer_name
                                                        }
                                                    </p>
                                                    <div className="flex mt-1">
                                                        {[1, 2, 3, 4, 5].map(
                                                            (star) => (
                                                                <span
                                                                    key={star}
                                                                    className={
                                                                        star <=
                                                                        review.rating
                                                                            ? "text-yellow-500"
                                                                            : "text-gray-300"
                                                                    }
                                                                >
                                                                    ★
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                                {user?.id ===
                                                    review.user_id && (
                                                    <button
                                                        onClick={() =>
                                                            deleteReview(
                                                                review.id
                                                            )
                                                        }
                                                        className="text-red-500 text-sm hover:text-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                            {review.comment && (
                                                <p className="text-navy-500 mt-2">
                                                    {review.comment}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
