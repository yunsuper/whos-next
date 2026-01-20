"use client";

import LottoCanvas from "@/components/machine/LottoCanvas";
import InputGroup from "@/components/ui/InputGroup";
import ResultModal from "@/components/ui/ResultModal";
import { useGameStore } from "@/store/useGameStore";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/layout/Footer";
import { cn, truncateText } from "@/lib/utils";
import { useEffect } from "react";

export default function Home() {
    const { history, loadStorage } = useGameStore();

    useEffect(() => {
        loadStorage();
    }, [loadStorage]);

    return (
        <main className={cn("main-layout")}>
            {/* 배경 조명 효과 */}
            <div className={cn("ambient-bg")}>
                <div className={cn("ambient-purple")} />
                <div className={cn("ambient-blue")} />
            </div>

            {/* 헤더 섹션 */}
            <div className={cn("hero-header")}>
                <h1 className={cn("hero-title")}>WHO&apos;S NEXT?</h1>
                <p className={cn("hero-subtitle")}>Your Fate is Rolling</p>
            </div>

            {/* 메인 콘텐츠 그리드 */}
            <div className={cn("content-grid")}>
                {/* 1. 로또 머신 섹션 */}
                <div className={cn("lotto-machine-wrapper")}>
                    <div className="relative z-20">
                        <LottoCanvas />
                        {/* 반사광 효과 (유틸리티 클래스로 분리됨) */}
                        <div className={cn("glass-sheen")} />
                    </div>

                    {/* 머신 하단 받침대 */}
                    <div className={cn("lotto-machine-base")}>
                        <div className={cn("machine-neck")} />
                        <div className={cn("machine-base-body")}>
                            <div className={cn("system-status")}>
                                <div className={cn("status-light")} />
                                <span className="text-sm font-black text-red-500 tracking-widest uppercase">
                                    System Active
                                </span>
                            </div>

                            <div className={cn("scan-bar-container")}>
                                <motion.div
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                        ease: "linear",
                                    }}
                                    className={cn("scan-bar-active")}
                                />
                            </div>
                        </div>
                        {/* 하단 그림자 (UI 클래스로 통합 관리 권장) */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-56 h-4 bg-black/60 blur-md rounded-full -z-10" />
                    </div>
                </div>

                {/* 2. 컨트롤러 & 히스토리 섹션 */}
                <div className="w-full max-w-md flex flex-col gap-8">
                    <InputGroup />

                    {/* 당첨 내역 패널 */}
                    <div className={cn("history-panel")}>
                        <div className={cn("history-header")}>
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
                            <div
                                className={cn(
                                    "grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar",
                                )}
                            >
                                {history.map((name, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={`winner-${idx}-${name}`}
                                        className={cn(
                                            "winner-card",
                                            "hover:border-yellow-500/30 transition-colors",
                                        )}
                                    >
                                        <span className="text-yellow-500 text-[10px] block mb-1 uppercase tracking-tighter">
                                            WINNER {idx + 1}
                                        </span>
                                        <span className="truncate block font-bold">
                                            {truncateText(name, 10)}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className={cn("history-empty")}>
                                <p>No winners yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ResultModal />
            <Footer />
        </main>
    );
}
