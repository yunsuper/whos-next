"use client";

import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect, useCallback } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useAudio } from "@/hooks/useAudio";

export default function ResultModal() {
    const { winners, setWinners, pickWinner } = useGameStore();
    const winner = winners[0];
    const { playSound } = useAudio();

    // 확인 및 저장 로직을 하나의 함수로 공통화 (useCallback으로 최적화)
    const handleConfirm = useCallback(() => {
        if (winner) {
            pickWinner(winner);
            playSound("click"); // 조작 피드백 사운드
        }
        setWinners([]);
    }, [winner, pickWinner, setWinners, playSound]);

    // 마우스 클릭 핸들러
    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleConfirm();
    };

    // 엔터 키 이벤트 리스너
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 모달이 떠 있고 엔터 키를 눌렀을 때만 작동
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

    // 축하 효과 (사운드 + 폭죽)
    useEffect(() => {
        if (winner) {
            playSound("win");
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = {
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                zIndex: 110,
            };

            const interval: NodeJS.Timeout = setInterval(() => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: Math.random(), y: Math.random() - 0.2 },
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [winner, playSound]);

    return (
        <AnimatePresence>
            {winner && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-xl">
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
                        <div className="w-64 h-64 rounded-full bg-linear-to-br from-yellow-400 to-orange-600 border-8 border-white shadow-[0_0_60px_rgba(251,191,36,0.6)] flex items-center justify-center text-5xl font-black text-slate-900 p-4 text-center">
                            {winner}
                        </div>
                        <button
                            onClick={handleCloseClick}
                            className="mt-12 px-10 py-4 bg-yellow-400 text-black rounded-full font-black text-xl hover:bg-yellow-300 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-90 z-120 cursor-pointer flex flex-col items-center"
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
