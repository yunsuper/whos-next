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
        <main className="relative min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center py-12 px-4 overflow-x-hidden">
            {/* 배경 장식 */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 blur-[150px] rounded-full" />
            </div>

            <div className="text-center mb-16 z-10 w-full">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 pb-2">
                    WHO&apos;S NEXT?
                </h1>
                <p className="text-slate-400 text-lg md:text-xl font-light tracking-[0.3em] mt-2 uppercase">
                    Your Fate is Rolling
                </p>
            </div>

            {/* 메인 콘텐츠 그리드 */}
            <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-16 xl:gap-24 w-full max-w-7xl z-10">
                {/* 로또 머신 섹션 (받침대 분리형) */}
                <div className="flex flex-col items-center shrink-0">
                    {/* 상단 원형 유리관 */}
                    <div className="relative z-20">
                        <LottoCanvas />
                        {/* 유리 질감 반사광 (캔버스 위로 배치) */}
                        <div className="absolute top-10 left-10 w-32 h-16 bg-white/5 rounded-[100%] blur-3xl -rotate-45 pointer-events-none" />
                    </div>

                    {/* 하단 제어부 받침대 (Canvas와 겹치지 않게 배치) */}
                    <div className="relative w-72 h-24 -mt-6 z-10">
                        {/* 기계적인 연결 목 부분 */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-slate-800 border-x-4 border-slate-700 shadow-inner" />

                        {/* 메인 베이스 바디 */}
                        <div className="absolute bottom-0 w-full h-20 bg-linear-to-b from-slate-700 via-slate-800 to-slate-950 rounded-2xl border-x-4 border-b-8 border-slate-900 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center overflow-hidden">
                            {/* 시스템 활성 표시등 */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_#dc2626]" />
                                <span className="text-sm font-black text-red-500 tracking-widest uppercase">
                                    System Active
                                </span>
                            </div>

                            {/* 하단 장식 바 (이미지 참고) */}
                            <div className="w-32 h-1.5 bg-red-900/50 rounded-full overflow-hidden border border-red-500/30">
                                <motion.div
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                        ease: "linear",
                                    }}
                                    className="w-1/2 h-full bg-red-500 shadow-[0_0_10px_#ef4444]"
                                />
                            </div>
                        </div>

                        {/* 바닥 그림자 */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-56 h-4 bg-black/60 blur-md rounded-full -z-10" />
                    </div>
                </div>

                {/* 컨트롤러 섹션 */}
                <div className="w-full max-w-md flex flex-col gap-8">
                    <InputGroup />

                    {/* 히스토리 패널 */}
                    <div className="bg-slate-900/80 p-6 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
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
                                        className="bg-linear-to-br from-white/10 to-transparent border border-white/5 px-4 py-3 rounded-xl text-center font-bold text-slate-200"
                                    >
                                        <span className="text-yellow-500 text-[10px] block mb-1 uppercase tracking-tighter">
                                            WINNER {idx + 1}
                                        </span>
                                        <span className="font-bold text-slate-100 truncate block">
                                            {name}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-slate-600 border-2 border-dashed border-white/5 rounded-2xl bg-white/2">
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
