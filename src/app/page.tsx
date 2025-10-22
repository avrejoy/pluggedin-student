import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight font-gtwpro mb-4 sm:mb-6">
                        Your direct plug to
                        <br />
                        campus businesses
                    </h1>
                    <p className="text-sm sm:text-lg md:text-xl mb-12 max-w-2xl mx-auto font-gtwpro py-2">
                        Join students discovering and supporting businesses run
                        by their classmates. One platform to find tutors, food,
                        barbers, clothing, and more on campus
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/browse"
                            className="px-8 py-3.5 border-[1.3px] rounded-[15px] transition-all text-[15px] font-medium font-gtwpro  border-navy-600 text-navy-600"
                        >
                            Browse Businesses
                        </Link>
                        <Link
                            href="/list-business"
                            className="px-8 py-3.5 border-[1.3px] border-navy-600 bg-navy-600 text-cream-50 rounded-[15px] transition-all text-[15px] font-medium font-gtwpro"
                        >
                            List Your Business
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Categories Section */}
            <section className="py-20 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-gtwpro font-semibold mb-12 text-center tracking-tight">
                        Explore Categories
                    </h2>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 pt-0 md:pt-4">
                        {[
                            {
                                emoji: "🛍️",
                                title: "Resell & Marketplace",
                                color: "bg-brown-200",
                            },
                            {
                                emoji: "💇",
                                title: "Beauty & Care",
                                color: "bg-neutral-200",
                            },
                            {
                                emoji: "📚",
                                title: "Tutoring",
                                color: "bg-orange-50",
                            },
                            {
                                emoji: "💅",
                                title: "Nails",
                                color: "bg-orange-200",
                            },
                            {
                                emoji: "🎨",
                                title: "Creative & Design",
                                color: "bg-neutral-100",
                            },
                            {
                                emoji: "🍱",
                                title: "Food & Meal Prep",
                                color: "bg-orange-100",
                            },
                        ].map((item, i) => (
                            <Link
                                key={i}
                                href={`/browse?category=${item.title.toLowerCase()}`}
                            >
                                <div
                                    className={`border-[0.4px] border-navy-500/15 rounded-[22px] md:rounded-[30px] py-6 md:py-8 px-3 md:px-4 h-auto flex flex-col gap-5 hover:shadow-md transition-all duration-500 transform hover:-translate-y-1`}
                                >
                                    <div className="text-3xl md:text-5xl text-center">
                                        {item.emoji}
                                    </div>
                                    <h3 className="text-sm md:text-xl font-medium md:font-semibold text-navy-600 text-center font-gtwpro">
                                        {item.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Discover Your Campus Community Section */}
            <section className="py-6 sm:py-16 md:py-24 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-gtwpro font-semibold mb-12 text-center tracking-tight">
                        Discover Your Campus Community
                    </h2>

                    <div className="grid sm:grid-cols-3 gap-6 md:gap-10">
                        {[
                            {
                                icon: "📍",
                                title: "Find Local Services",
                                desc: "Discover tutors, food vendors, barbers, and more — all within your university.",
                            },
                            {
                                icon: "💖",
                                title: "Support Classmates",
                                desc: "Buy from fellow students and help their side hustles grow.",
                            },
                            {
                                icon: "🌱",
                                title: "Build Community",
                                desc: "Connect with entrepreneurs and collaborate on creative ventures.",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="border-[0.4px] border-navy-500/15 rounded-[25px] p-6 hover:shadow-lg transition-all duration-500"
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-xl text-navy-500 mb-2 font-gtwpro font-semibold">
                                    {item.title}
                                </h3>
                                <p className="text-navy-600 font-gtwpro font-normal text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-5 py-10 md:py-16 px-4 md:px-6">
                <div className="max-w-8xl mx-auto grid sm:grid-cols-3 gap-12">
                    <div>
                        <h3 className="text-xl mb-3 font-gtwpro font-extrabold">
                            PLUGGED<span className="text-brown-500">IN</span>
                        </h3>
                        <p className="text-navy-500 leading-relaxed font-gtwpro text-sm">
                            Connecting students with the businesses that power
                            their campus life.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-gtwpro font-semibold text-navy-600 mb-4">
                            Platform
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/browse"
                                    className="text-sm font-gtwpro font-normal hover:text-brown-500 transition-colors duration-300 ease-in-out"
                                >
                                    Browse Businesses
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/list-business"
                                    className="text-sm font-gtwpro font-normal hover:text-brown-500 transition-colors duration-300 ease-in-out"
                                >
                                    List Your Business
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/how-it-works"
                                    className="text-sm font-gtwpro font-normal hover:text-brown-500 transition-colors duration-300 ease-in-out"
                                >
                                    How it works
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-gtwpro font-semibold text-navy-600 mb-4">
                            Support
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/help"
                                    className="text-sm font-gtwpro font-normal hover:text-brown-500 transition-colors duration-300 ease-in-out"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-sm font-gtwpro font-normal hover:text-brown-500 transition-colors duration-300 ease-in-out"
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-center text-navy-600 text-sm font-gtwpro font-medium mt-10 border-t border-brown-300/20 pt-6">
                    © 2025 PluggedIn. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
