"use client";

import React, { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Plus, Play, RotateCcw, Trash2 } from "lucide-react";

export default function InputGroup() {
    const [text, setText] = useState("");
    const {
        participants,
        addParticipant,
        removeParticipant,
        isDrawing,
        setIsDrawing,
        setWinners, // 1. 여기서 setWinners를 가져와야 합니다.
        resetGame,
    } = useGameStore();

    const handleAdd = () => {
        if (!text.trim()) return;
        addParticipant(text.trim());
        setText("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleAdd();
    };

    // 2. DRAW 버튼 클릭 시 실행될 핵심 로직
    const handleDraw = () => {
        if (participants.length === 0 || isDrawing) return;

        setIsDrawing(true);
        setWinners([]); // 새로운 추첨 시작 시 이전 당첨자 초기화

        // 3초간 마구 섞은 후 당첨자 선정
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * participants.length);
            const selectedWinner = participants[randomIndex];

            setIsDrawing(false);
            setWinners([selectedWinner]); // 당첨자 확정 -> ResultModal이 뜹니다.
        }, 3000);
    };

    return (
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md w-full">
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="팀 이름이나 참가자 입력"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                    onClick={handleAdd}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-lg transition-colors"
                >
                    <Plus />
                </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto mb-6 custom-scrollbar">
                {participants.map((p, idx) => (
                    <div
                        key={idx}
                        className="flex justify-between items-center bg-slate-800/50 px-3 py-2 rounded-md border border-white/5"
                    >
                        <span className="text-sm">{p}</span>
                        <button
                            onClick={() => removeParticipant(idx)}
                            className="text-slate-500 hover:text-red-400"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    // 3. onClick에 handleDraw를 연결합니다.
                    onClick={handleDraw}
                    disabled={participants.length === 0 || isDrawing}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                        isDrawing
                            ? "bg-red-500 animate-pulse cursor-not-allowed"
                            : "bg-linear-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black shadow-lg"
                    } disabled:opacity-50`}
                >
                    <Play size={20} fill="currentColor" />
                    {isDrawing ? "MIXING..." : "DRAW"}
                </button>

                <button
                    onClick={() => {
                        resetGame();
                        window.location.reload();
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold border border-white/10"
                >
                    <RotateCcw size={20} />
                    RESET
                </button>
            </div>
        </div>
    );
}
