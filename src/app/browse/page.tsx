"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import Image from "next/image";

interface Business {
    id: string;
    business_name: string;
    tagline: string;
    category_id: number;
    profile_image_url: string | null;
}

const categories = [
    { id: 0, name: "All Categories" },
    { id: 1, name: "Beauty & Hair" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Food & Baking" },
    { id: 4, name: "Tutoring" },
    { id: 5, name: "Creative & Design" },
    { id: 6, name: "Nails" },
    { id: 7, name: "Resell & Marketplace" },
    { id: 8, name: "Other" },
];

export default function BrowsePage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>(
        []
    );
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBusinesses();
    }, []);

    useEffect(() => {
        let filtered = businesses;

        // Filter by category
        if (selectedCategory !== 0) {
            filtered = filtered.filter(
                (b) => b.category_id === selectedCategory
            );
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (b) =>
                    b.business_name.toLowerCase().includes(query) ||
                    (b.tagline && b.tagline.toLowerCase().includes(query))
            );
        }

        setFilteredBusinesses(filtered);
    }, [selectedCategory, searchQuery, businesses]);

    async function fetchBusinesses() {
        try {
            const { data, error } = await supabase
                .from("businesses")
                .select(
                    "id, business_name, tagline, category_id, profile_image_url"
                )
                .order("created_at", { ascending: false });

            if (error) throw error;
            setBusinesses(data || []);
            setFilteredBusinesses(data || []);
        } catch (error) {
            console.error("Error fetching businesses:", error);
        } finally {
            setLoading(false);
        }
    }

    function getCategoryName(categoryId: number) {
        return categories.find((c) => c.id === categoryId)?.name || "Other";
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-5 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-gtwpro font-semibold text-navy-500 mb-4">
                        PLUGGED<span className="text-brown-500">IN</span>
                    </h1>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search businesses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-5 py-4 rounded-[20px] border-[1.5px] border-navy-500/10 text-navy-500 focus:border-navy-500 focus:outline-none transition-colors duration-300 font-gtwpro placeholder:text-navy-600/50 text-[15px]"
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="w-full flex justify-center">
                    <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-4 py-3 flex-wrap sm:justify-center max-w-5xl">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`shrink-0 rounded-full border border-navy-500/20 px-5 py-2 text-xs sm:text-sm font-medium text-navy-500 hover:bg-navy-500/10 hover:border-navy-500/20 transition-all duration-200 whitespace-nowrap font-gtwpro cursor-pointer ${
                                    selectedCategory === category.id &&
                                    "bg-navy-600! text-background!"
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-20">
                        <div className="text-navy-600 text-base font-medium font-gtwpro">
                            Loading businesses...
                        </div>
                    </div>
                )}

                {!loading && filteredBusinesses.length === 0 && (
                    <div className="text-center py-20">
                        <h2 className="text-xl font-semibold text-navy-600 mb-4 font-gtwpro">
                            No businesses found
                        </h2>
                        <p className="text-navy-500 mb-8 font-gtwpro text-sm">
                            {searchQuery
                                ? "Try adjusting your search"
                                : "Be the first to list a business in this category!"}
                        </p>
                        {!searchQuery && (
                            <Link
                                href="/list-business"
                                className="inline-block px-8 py-3.5 border font-gtwpro border-navy-500/15 text-navy-600 font-medium text-sm rounded-[16px] hover:bg-navy-600 hover:text-background duration-300 ease-in-out transition-all"
                            >
                                List Your Business
                            </Link>
                        )}
                    </div>
                )}

                {!loading && filteredBusinesses.length > 0 && (
                    <div>
                        <p className="text-center text-navy-500 mb-6 py-4 font-gtwpro font-medium">
                            {filteredBusinesses.length}{" "}
                            {filteredBusinesses.length === 1
                                ? "business"
                                : "businesses"}{" "}
                            found
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBusinesses.map((business) => (
                                <Link
                                    key={business.id}
                                    href={`/business/${business.id}`}
                                    className="group"
                                >
                                    <div className="rounded-[24px] overflow-hidden border-[1.3px] border-navy-600/20 transition-all">
                                        <div className="aspect-square bg-brown-200 flex items-center justify-center">
                                            <Image
                                                src={
                                                    business.profile_image_url
                                                        ? business.profile_image_url
                                                        : require("../../assets/images/thumbnail.jpeg")
                                                }
                                                alt={business.business_name}
                                                width={250}
                                                height={400}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="px-5 py-4  font-gtwpro">
                                            <div className="text-sm text-brown-500 mb-2">
                                                {getCategoryName(
                                                    business.category_id
                                                )}
                                            </div>
                                            <h3 className="text-xl font-semibold text-navy-600 mb-2 group-hover:text-brown-500 transition-colors">
                                                {business.business_name}
                                            </h3>
                                            {business.tagline && (
                                                <p className="text-navy-500 line-clamp-2">
                                                    {business.tagline}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
