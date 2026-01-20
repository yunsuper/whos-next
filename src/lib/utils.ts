import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind 클래스를 조건부로 결합하고 병합하는 유틸리티
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 긴 텍스트를 줄임표(...) 처리하는 유틸리티
 */
export function truncateText(text: string, maxLength: number = 5) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "..";
}

/**
 * 로컬 스토리지 저장/불러오기 유틸리티
 */
export const storage = {
    set: <T>(key: string, value: T): void => {
        if (typeof window !== "undefined") {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },
    get: <T>(key: string): T | null => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(key);
            try {
                return saved ? (JSON.parse(saved) as T) : null;
            } catch (error) {
                console.error("Storage parsing error:", error);
                return null;
            }
        }
        return null;
    },
};
