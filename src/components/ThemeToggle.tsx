"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-9 h-9" /> // Placeholder to prevent layout shift
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative p-2 rounded-full hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors group"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === "dark" ? 0 : 1,
                        rotate: theme === "dark" ? 90 : 0,
                        opacity: theme === "dark" ? 0 : 1
                    }}
                    className="absolute inset-0 flex items-center justify-center text-earth-800 dark:text-earth-200"
                >
                    <Sun size={20} className="group-hover:text-gold-600 transition-colors" />
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === "dark" ? 1 : 0,
                        rotate: theme === "dark" ? 0 : -90,
                        opacity: theme === "dark" ? 1 : 0
                    }}
                    className="absolute inset-0 flex items-center justify-center text-earth-800 dark:text-earth-200"
                >
                    <Moon size={20} className="group-hover:text-gold-600 transition-colors" />
                </motion.div>
            </div>
        </button>
    );
}
