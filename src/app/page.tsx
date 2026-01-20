"use client";

import LottoCanvas from "@/components/machine/LottoCanvas";
import InputGroup from "@/components/ui/InputGroup";
import ResultModal from "@/components/ui/ResultModal";
import { useGameStore } from "@/store/useGameStore";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
    const { history } = useGameStore();

    return (
        <main className="main-layout">
            {/* 배경 장식 */}
            <div className="ambient-bg">
                <div className="ambient-purple" />
                <div className="ambient-blue" />
            </div>

            <div className="hero-header">
                <h1 className="hero-title">WHO&apos;S NEXT?</h1>
                <p className="hero-subtitle">Your Fate is Rolling</p>
            </div>

            <div className="content-grid">
                {/* 로또 머신 섹션 */}
                <div className="lotto-machine-wrapper">
                    <div className="relative z-20">
                        <LottoCanvas />
                        <div className="absolute top-10 left-10 w-32 h-16 bg-white/5 rounded-[100%] blur-3xl -rotate-45 pointer-events-none" />
                    </div>

                    <div className="lotto-machine-base">
                        <div className="machine-neck" />
                        <div className="machine-base-body">
                            <div className="system-status">
                                <div className="status-light" />
                                <span className="text-sm font-black text-red-500 tracking-widest uppercase">
                                    System Active
                                </span>
                            </div>

                            <div className="scan-bar-container">
                                <motion.div
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                        ease: "linear",
                                    }}
                                    className="scan-bar-active"
                                />
                            </div>
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-56 h-4 bg-black/60 blur-md rounded-full -z-10" />
                    </div>
                </div>

                {/* 컨트롤러 & 히스토리 섹션 */}
                <div className="w-full max-w-md flex flex-col gap-8">
                    <InputGroup />

                    <div className="history-panel">
                        <div className="history-header">
                            <div className="flex items-center gap-3 text-yellow-400">
                                <Trophy size={22} />
                                <h2 className="font-black text-xl uppercase tracking-wider">
                                    History
                                </h2>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">
                                COUNT: {history.length}
                            </span>
                        </div>

                        {history.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                                {history.map((name, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={`winner-${idx}-${name}`}
                                        className="winner-card"
                                    >
                                        <span className="text-yellow-500 text-[10px] block mb-1 uppercase tracking-tighter">
                                            WINNER {idx + 1}
                                        </span>
                                        <span className="truncate block">
                                            {name}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="history-empty">
                                <p>No winners yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ResultModal />
        </main>
    );
}
