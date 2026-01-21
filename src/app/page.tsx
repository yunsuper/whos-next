"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InputGroup from "@/components/ui/InputGroup";
import ResultModal from "@/components/ui/ResultModal";

import { useGameStore } from "@/store/useGameStore";
import { cn, truncateText } from "@/lib/utils";
import SupportCard from "@/components/ui/SupportCard";
import dynamic from "next/dynamic";

const LottoCanvas = dynamic(() => import("@/components/machine/LottoCanvas"), {
    ssr: false,
    loading: () => (
        <div className="w-100 h-100 bg-white/5 rounded-full animate-pulse" />
    ), 
});

export default function Home() {
    const [isHydrated, setIsHydrated] = useState(false);
    const { history } = useGameStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsHydrated(true);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    if (!isHydrated) {
        return (
            <main
                className={cn("main-layout flex items-center justify-center")}
            >
                <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </main>
        );
    }

    return (
        <main className={cn("main-layout")}>
            {/* 1. 배경 장식 */}
            <div className={cn("ambient-bg")}>
                <div className={cn("ambient-purple")} />
                <div className={cn("ambient-blue")} />
            </div>

            {/* 2. 헤더 섹션 */}
            <Header />

            {/* 3. 메인 콘텐츠 그리드 */}
            <div className={cn("content-grid")}>
                {/* 3-1. 로또 머신 섹션 */}
                <section className={cn("lotto-machine-wrapper")}>
                    <div className="relative z-20">
                        <LottoCanvas />
                        <div className={cn("glass-sheen")} />
                    </div>

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
                        {/* 머신 그림자 */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-56 h-4 bg-black/60 blur-md rounded-full -z-10" />
                    </div>
                </section>

                {/* 3-2. 컨트롤러 및 히스토리 섹션 */}
                <section className="w-full max-w-md flex flex-col gap-6">
                    <InputGroup />

                    <div className={cn("history-panel")}>
                        <header className={cn("history-header")}>
                            <div className="flex items-center gap-3 text-yellow-400">
                                <Trophy size={22} />
                                <h2 className="font-black text-xl uppercase tracking-wider">
                                    History
                                </h2>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">
                                COUNT: {history.length}
                            </span>
                        </header>

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

                    <SupportCard />
                </section>
            </div>

            {/* 4. 공통 UI 요소 */}
            <ResultModal />
            <Footer />
        </main>
    );
}
