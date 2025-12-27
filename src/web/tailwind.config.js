// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';
import animate from "tailwindcss-animate";

export default {
    // ...
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Geist Sans"', ...defaultTheme.fontFamily.sans],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            screens: {
                xs: "375px",
            },
            animation: {
                marquee: "marquee var(--duration) linear infinite",
                "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
            },
            keyframes: {
                marquee: {
                    from: {
                        transform: "translateX(0)",
                    },
                    to: {
                        transform: "translateX(calc(-100% - var(--gap)))",
                    },
                },
                "marquee-vertical": {
                    from: {
                        transform: "translateY(0)",
                    },
                    to: {
                        transform: "translateY(calc(-100% - var(--gap)))",
                    },
                },
            },
        },
    },
    plugins: [animate],
};
