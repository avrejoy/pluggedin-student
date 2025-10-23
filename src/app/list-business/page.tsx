"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import CustomInput from "../components/form/CustomInput";

export default function ListBusinessPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

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
        setLoading(true);
        setError("");

        if (!user) {
            setError("You must be logged in to create a business");
            setLoading(false);
            return;
        }

        try {
            const dataToInsert = {
                name: formData.name,
                business_name: formData.business_name,
                tagline: formData.tagline,
                description: formData.description,
                category_id: parseInt(formData.category_id),
                contact_email: formData.contact_email,
                contact_phone: formData.contact_phone,
                instagram_handle: formData.instagram_handle,
                website_url: formData.website_url,
                user_id: user.id, // Add user_id
            };

            const { data, error } = await supabase
                .from("businesses")
                .insert([dataToInsert])
                .select();

            if (error) throw error;

            const businessId = data[0].id;

            // Upload image if provided
            if (imageFile) {
                const imageUrl = await uploadImage(businessId);
                if (imageUrl) {
                    await supabase
                        .from("businesses")
                        .update({ profile_image_url: imageUrl })
                        .eq("id", businessId);
                }
            }

            alert("Business listed successfully!");
            router.push(`/business/${businessId}`);
        } catch (err: any) {
            console.error("Error creating business:", err);
            setError(
                err.message ||
                    "Failed to list business. Please check console for details."
            );
        } finally {
            setLoading(false);
        }
    }

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-navy-600 text-lg font-gtwpro font-medium">
                    Loading...
                </div>
            </div>
        );
    }

    // Show login prompt if not authenticated
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-navy-600 mb-4">
                        Please log in to list your business
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
        <div className="min-h-screen py-14 px-3 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-gtwpro text-navy-600 font-semibold mb-4">
                        List Your Business
                    </h1>
                    <p className="text-sm sm:text-base text-navy-500">
                        Join the PluggedIn community and start connecting with
                        students on campus
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="p-1 sm:p-10 rounded-[25px] sm:border border-navy-600/15 space-y-6"
                >
                    {/* Profile Image Upload */}
                    <div className="space-y-2">
                        <label className="block font-medium text-navy-700">
                            Profile Image
                        </label>
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            {imagePreview && (
                                <div className="w-28 h-28 rounded-xl border border-brown-200 overflow-hidden">
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
                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-brown-500 file:text-white file:cursor-pointer hover:file:bg-brown-600 w-full text-sm text-gray-700"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Recommended: Square image, at least
                                    400x400px
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Text Inputs */}
                    {[
                        {
                            label: "Owner Name *",
                            name: "name",
                            placeholder: "Your name",
                            required: true,
                        },
                        {
                            label: "Business Name *",
                            name: "business_name",
                            placeholder: "Enter your business name",
                            required: true,
                        },
                        {
                            label: "Tagline",
                            name: "tagline",
                            placeholder: "A short, catchy description",
                        },
                        {
                            label: "Contact Email *",
                            name: "contact_email",
                            placeholder: "your.email@university.edu",
                            required: true,
                            type: "email",
                        },
                        {
                            label: "Contact Phone",
                            name: "contact_phone",
                            placeholder: "(555) 123-4567",
                            type: "tel",
                        },
                        {
                            label: "Instagram Handle",
                            name: "instagram_handle",
                            placeholder: "@yourbusiness",
                        },
                        {
                            label: "Website",
                            name: "website_url",
                            placeholder: "https://yourbusiness.com",
                            type: "url",
                        },
                    ].map((field) => (
                        <div key={field.name}>
                            <CustomInput
                                name={field.name}
                                label={field.label}
                                value={
                                    formData[
                                        field.name as keyof typeof formData
                                    ]
                                }
                                setValue={handleChange}
                                type={field.type || "text"}
                                placeholder={field.placeholder}
                                inputClass="border-[1.3px] border-brown-200/50 focus:border-brown-400"
                            />
                        </div>
                    ))}

                    {/* Description */}
                    <div>
                        <label className="block text-navy-600 mb-1 text-sm font-gtwpro font-medium">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                            placeholder="Tell students about your business"
                            className="w-full px-4 py-3 rounded-[15px] border-[1.3px] border-brown-200/50 focus:border-brown-400 transition-colors duration-500 ease-in-out focus:outline-none text-navy-700 resize-none text-sm font-gtwpro"
                        />
                    </div>

                    {/* Category Select */}
                    <div>
                        <label className="block text-navy-600 mb-1 text-sm font-gtwpro font-medium">
                            Category *
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-4 rounded-[15px] border-[1.3px] border-brown-200/50 focus:border-brown-400 focus:outline-none text-sm font-gtwpro text-navy-700"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-6 bg-navy-600 text-white rounded-[15px] font-medium hover:bg-navy-500 transition disabled:opacity-50 disabled:cursor-not-allowed font-gtwpro cursor-pointer duration-500 ease-in-out"
                        >
                            {loading ? "Submitting..." : "List My Business"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
