"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useCallback } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useAudio } from "@/hooks/useAudio";
import { triggerConfetti } from "@/components/effects/Confetti"; // 분리한 파일 불러오기

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
            if (winner && e.key === "Enter") {
                handleConfirm();
            }
        };

        if (winner) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [winner, handleConfirm]);

    // 효과 적용 부분
    useEffect(() => {
        if (winner) {
            playSound("win");
            // 이제 한 줄로 실행 가능합니다!
            triggerConfetti();
        }
    }, [winner, playSound]);

    return (
        <AnimatePresence>
            {winner && (
                <div className="result-modal-overlay">
                    <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="relative z-110 flex flex-col items-center"
                    >
                        <div className="absolute inset-0 bg-yellow-500/20 blur-[120px] rounded-full animate-pulse" />

                        <div className="text-yellow-400 font-black text-3xl mb-8 tracking-widest animate-bounce">
                            CONGRATULATIONS!
                        </div>

                        <div className="winner-display-circle">{winner}</div>

                        <button
                            onClick={handleCloseClick}
                            className="confirm-button"
                        >
                            <span>확인 및 저장</span>
                            <span className="text-[10px] text-black/50 font-bold mt-1 uppercase tracking-tighter">
                                Press Enter
                            </span>
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
