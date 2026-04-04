"use client";

import { useEffect } from "react";

export function InitialScroll() {
    useEffect(() => {
        // Wait for layout to settle, then instantly scroll to the header
        // if the user is loading the page exactly at the top.
        const timer = setTimeout(() => {
            if (window.scrollY < 10) {
                const header = document.getElementById("main-nav");
                if (header) {
                    window.scrollTo({ top: header.offsetTop, behavior: "instant" });
                }
            }
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    return null;
}
