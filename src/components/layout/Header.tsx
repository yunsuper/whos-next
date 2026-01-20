"use client";

import { cn } from "@/lib/utils";

export default function Header() {
    return (
        <header className={cn("hero-header")}>
            <h1 className={cn("hero-title")}>WHO&apos;S NEXT?</h1>
            <p className={cn("hero-subtitle")}>Your Fate is Rolling</p>
        </header>
    );
}
