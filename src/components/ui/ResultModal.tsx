"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useCallback } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useAudio } from "@/hooks/useAudio";
import { triggerConfetti } from "@/components/effects/Confetti";
import { cn, truncateText } from "@/lib/utils";

export default function ResultModal() {
    const { winners, setWinners, pickWinner } = useGameStore();
    const winner = winners[0];
    const { playSound } = useAudio();

    const handleConfirm = useCallback(() => {
        if (winner) {
            pickWinner(winner);
            playSound("click");
        }
        setWinners([]);
    }, [winner, pickWinner, setWinners, playSound]);

    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleConfirm();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (winner && e.key === "Enter") handleConfirm();
        };

        if (winner) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [winner, handleConfirm]);

    useEffect(() => {
        if (winner) {
            playSound("win");
            triggerConfetti();
        }
    }, [winner, playSound]);

    return (
        <AnimatePresence>
            {winner && (
                <div className={cn("result-modal-overlay")}>
                    <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="relative z-110 flex flex-col items-center"
                    >
                        {/* CSS 유틸리티로 대체된 배경 빛무리 */}
                        <div className={cn("modal-glow-bg")} />

                        <div className={cn("congrats-text")}>
                            CONGRATULATIONS!
                        </div>

                        <div className={cn("winner-display-circle")}>
                            {truncateText(winner, 8)}
                        </div>

                        <button
                            onClick={handleCloseClick}
                            className={cn("confirm-button")}
                        >
                            <span>확인 및 저장</span>
                            <span className={cn("confirm-button-caption")}>
                                Press Enter
                            </span>
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
