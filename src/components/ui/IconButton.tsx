"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: LucideIcon;
    iconSize?: number;
    // variant 이름을 css 클래스명과 일치시키거나 매핑합니다.
    variant?: "primary" | "danger" | "draw" | "reset";
    isDrawing?: boolean;
}

export default function IconButton({
    icon: Icon,
    iconSize = 20,
    variant = "primary",
    isDrawing = false,
    className,
    children,
    ...props
}: IconButtonProps) {
    const variantClasses = {
        primary: "bg-yellow-500 text-black p-2 rounded-lg",
        danger: "text-slate-500 hover:text-red-400",
        reset: "reset-button",
        draw: isDrawing
            ? "draw-button draw-button-mixing"
            : "draw-button draw-button-active",
    };

    return (
        <button
            className={cn(
                "active:scale-95 transition-transform disabled:opacity-50 disabled:grayscale",
                variantClasses[variant],
                className,
            )}
            {...props}
        >
            <Icon
                size={iconSize}
                fill={variant === "draw" ? "currentColor" : "none"}
            />
            {children && <span>{children}</span>}
        </button>
    );
}
