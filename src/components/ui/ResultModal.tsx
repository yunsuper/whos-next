"use client";

import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useAudio } from "@/hooks/useAudio";

export default function ResultModal() {
    const { winners, setWinners, pickWinner } = useGameStore();
    const winner = winners[0];
    const { playSound } = useAudio();

    const handleClose = (e: React.MouseEvent) => {
        // 이벤트 전파 방지 및 확실한 핸들링
        e.stopPropagation();
        if (winner) {
            pickWinner(winner);
        }
        setWinners([]);
    };

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
            }; // zIndex 상향

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
                        <div className="w-64 h-64 rounded-full bg-linear-to-br from-yellow-400 to-orange-600 border-8 border-white shadow-[0_0_60px_rgba(251,191,36,0.6)] flex items-center justify-center text-5xl font-black text-slate-900 p-4">
                            {winner}
                        </div>
                        <button
                            onClick={handleClose}
                            className="mt-12 px-10 py-4 bg-yellow-400 text-black rounded-full font-black text-xl hover:bg-yellow-300 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-90 z-120 cursor-pointer"
                        >
                            확인 및 저장
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
