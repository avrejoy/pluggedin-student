"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";

interface Business {
    id: string;
    name: string;
    business_name: string;
    tagline: string;
    description: string;
    category_id: number;
    contact_email: string;
    contact_phone: string;
    instagram_handle: string;
    website_url: string;
    profile_image_url: string | null;
    user_id: string;
}

export default function EditBusinessPage() {
    const router = useRouter();
    const params = useParams();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [business, setBusiness] = useState<Business | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        business_name: "",
        tagline: "",
        description: "",
        category_id: "",
        contact_email: "",
        contact_phone: "",
        instagram_handle: "",
        website_url: "",
    });

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

    useEffect(() => {
        if (params.id) {
            fetchBusiness();
        }
    }, [params.id, user]);

    async function fetchBusiness() {
        try {
            const { data, error } = await supabase
                .from("businesses")
                .select("*")
                .eq("id", params.id)
                .single();

            if (error) throw error;

            // Check if user owns this business
            if (user && data.user_id !== user.id) {
                router.push(`/business/${params.id}`);
                return;
            }

            setBusiness(data);
            setFormData({
                name: data.name || "",
                business_name: data.business_name || "",
                tagline: data.tagline || "",
                description: data.description || "",
                category_id: data.category_id?.toString() || "",
                contact_email: data.contact_email || "",
                contact_phone: data.contact_phone || "",
                instagram_handle: data.instagram_handle || "",
                website_url: data.website_url || "",
            });
            setImagePreview(data.profile_image_url);
        } catch (error) {
            console.error("Error fetching business:", error);
            setError("Failed to load business");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
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

    async function uploadImage(businessId: string): Promise<string | null> {
        if (!imageFile) return null;

        try {
            const fileExt = imageFile.name.split(".").pop();
            const fileName = `${businessId}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("business-images")
                .upload(filePath, imageFile, { upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from("business-images")
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");

        if (!user || !business) {
            setError("Unauthorized");
            setSaving(false);
            return;
        }

        try {
            const dataToUpdate = {
                name: formData.name,
                business_name: formData.business_name,
                tagline: formData.tagline,
                description: formData.description,
                category_id: parseInt(formData.category_id),
                contact_email: formData.contact_email,
                contact_phone: formData.contact_phone,
                instagram_handle: formData.instagram_handle,
                website_url: formData.website_url,
            };

            const { error } = await supabase
                .from("businesses")
                .update(dataToUpdate)
                .eq("id", params.id);

            if (error) throw error;

            // Upload new image if provided
            if (imageFile) {
                const imageUrl = await uploadImage(params.id as string);
                if (imageUrl) {
                    await supabase
                        .from("businesses")
                        .update({ profile_image_url: imageUrl })
                        .eq("id", params.id);
                }
            }

            alert("Business updated successfully!");
            router.push(`/business/${params.id}`);
        } catch (err: any) {
            console.error("Error updating business:", err);
            setError(err.message || "Failed to update business.");
        } finally {
            setSaving(false);
        }
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-navy-600 text-lg font-gtwpro font-medium">
                    Loading...
                </div>
            </div>
        );
    }

    if (!user || !business) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-navy-600 mb-4">
                        Unauthorized
                    </h2>
                    <Link
                        href="/login"
                        className="text-brown-500 hover:text-brown-400"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link
                    href={`/business/${params.id}`}
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
                        Edit Business
                    </h1>
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
                            Profile Image
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
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-brown-300 file:text-navy-600 file:cursor-pointer hover:file:bg-brown-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-navy-600 font-semibold mb-2">
                            Owner Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-navy-600 font-semibold mb-2">
                            Business Name *
                        </label>
                        <input
                            type="text"
                            name="business_name"
                            required
                            value={formData.business_name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-navy-600 font-semibold mb-2">
                            Tagline
                        </label>
                        <input
                            type="text"
                            name="tagline"
                            value={formData.tagline}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-navy-600 font-semibold mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-navy-600 font-semibold mb-2">
                            Category *
                        </label>
                        <select
                            name="category_id"
                            required
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-navy-600 font-semibold mb-2">
                            Contact Email *
                        </label>
                        <input
                            type="email"
                            name="contact_email"
                            required
                            value={formData.contact_email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-navy-600 font-semibold mb-2">
                            Contact Phone
                        </label>
                        <input
                            type="tel"
                            name="contact_phone"
                            value={formData.contact_phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-navy-600 font-semibold mb-2">
                            Instagram Handle
                        </label>
                        <input
                            type="text"
                            name="instagram_handle"
                            value={formData.instagram_handle}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-navy-600 font-semibold mb-2">
                            Website
                        </label>
                        <input
                            type="url"
                            name="website_url"
                            value={formData.website_url}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-brown-200 bg-cream-100 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full px-8 py-4 bg-navy-600 text-cream-50 rounded-lg font-semibold hover:bg-navy-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
