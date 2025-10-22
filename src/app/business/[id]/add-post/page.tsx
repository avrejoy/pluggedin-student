"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function AddPostPage() {
    const router = useRouter();
    const params = useParams();
    const businessId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    async function uploadImage(postId: string): Promise<string | null> {
        if (!imageFile) return null;

        try {
            const fileExt = imageFile.name.split(".").pop();
            const fileName = `${postId}-${Date.now()}.${fileExt}`;
            const filePath = fileName;

            console.log("Uploading to:", filePath);

            const { data: uploadData, error: uploadError } =
                await supabase.storage
                    .from("post-images")
                    .upload(filePath, imageFile, { upsert: true });

            if (uploadError) {
                console.error("Upload error:", uploadError);
                throw uploadError;
            }

            console.log("Upload successful:", uploadData);

            const { data } = supabase.storage
                .from("post-images")
                .getPublicUrl(filePath);
            console.log("Public URL:", data.publicUrl);

            return data.publicUrl;
        } catch (error) {
            console.error("Error in uploadImage:", error);
            return null;
        }
    }

    // ✅ MODIFIED INSERT SECTION
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Upload image first if provided
            let imageUrl = null;
            if (imageFile) {
                const tempId = Date.now().toString();
                imageUrl = await uploadImage(tempId);
            }

            // Get current user
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("You must be logged in to create posts");
            }

            // Insert post with image_url and user_id already included
            const { data, error } = await supabase
                .from("business_posts")
                .insert([
                    {
                        business_id: parseInt(businessId as string),
                        title: formData.title,
                        description: formData.description,
                        image_url: imageUrl,
                        user_id: user.id, // ✅ Added this line
                    },
                ])
                .select();

            if (error) throw error;

            alert("Post created successfully!");
            router.push(`/business/${businessId}`);
        } catch (err: any) {
            console.error("Error creating post:", err);
            setError(err.message || "Failed to create post.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link
                    href={`/business/${businessId}`}
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
                    Back to Business
                </Link>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-navy-600 mb-4">
                        Add Portfolio Post
                    </h1>
                    <p className="text-lg text-navy-500">
                        Showcase your work, products, or services
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="bg-cream-50 rounded-2xl p-8 border-2 border-brown-200"
                >
                    <div className="mb-6">
                        <label className="block text-navy-600 font-semibold mb-2">
                            Image *
                        </label>
                        <div className="flex items-start gap-4">
                            {imagePreview && (
                                <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-brown-200">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    required
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-brown-300 file:text-navy-600 file:cursor-pointer hover:file:bg-brown-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-navy-600 font-semibold mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors"
                            placeholder="Give your post a title"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-navy-600 font-semibold mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors resize-none"
                            placeholder="Add details about this work..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-8 py-4 bg-navy-600 text-cream-50 rounded-lg font-semibold hover:bg-navy-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Post..." : "Create Post"}
                    </button>
                </form>
            </div>
        </div>
    );
}
