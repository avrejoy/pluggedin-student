import type { Config } from "tailwindcss";

export default {
    content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            fontFamily: {
                gtwalsheim: ["GTWPro", "sans-serif"],
            },
            boxShadow: {},
        },
    },
    plugins: [],
} satisfies Config;
