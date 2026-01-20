"use client";

import React, { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Plus, Play, RotateCcw, Trash2 } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils";

export default function InputGroup() {
    const [text, setText] = useState("");
    const { playSound } = useAudio();
    const {
        participants,
        addParticipant,
        removeParticipant,
        isDrawing,
        setIsDrawing,
        setWinners,
        resetGame,
    } = useGameStore();

    const handleAdd = () => {
        if (!text.trim()) return;
        addParticipant(text.trim());
        playSound("click");
        setText("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleAdd();
    };

    const handleDraw = () => {
        if (participants.length === 0 || isDrawing) return;
        playSound("click");
        setIsDrawing(true);
        setWinners([]);

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * participants.length);
            const selectedWinner = participants[randomIndex];
            setIsDrawing(false);
            setWinners([selectedWinner]);
        }, 3000);
    };

    return (
        <div className={cn("control-panel")}>
            {/* 입력 섹션 */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="팀 이름이나 참가자 입력"
                    className={cn("input-field")}
                />
                <button
                    onClick={handleAdd}
                    className={cn(
                        "bg-yellow-500 text-black p-2 rounded-lg active:scale-95 transition-transform",
                    )}
                >
                    <Plus />
                </button>
            </div>

            {/* 리스트 섹션 */}
            <div
                className={cn(
                    "space-y-2 max-h-48 overflow-y-auto mb-6 custom-scrollbar",
                )}
            >
                {participants.length > 0 ? (
                    participants.map((p, idx) => (
                        <div
                            key={`${p}-${idx}`}
                            className={cn("participant-item")}
                        >
                            <span className="text-sm font-medium">{p}</span>
                            <button
                                onClick={() => removeParticipant(idx)}
                                className={cn(
                                    "text-slate-500 hover:text-red-400",
                                )}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className={cn("history-empty")}>
                        <p className="text-xs">참가자를 추가해주세요</p>
                    </div>
                )}
            </div>

            {/* 하단 버튼 섹션 */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={handleDraw}
                    disabled={participants.length === 0 || isDrawing}
                    className={cn(
                        "draw-button",
                        isDrawing ? "draw-button-mixing" : "draw-button-active",
                        participants.length === 0 &&
                            "opacity-50 grayscale cursor-not-allowed",
                    )}
                >
                    <Play size={20} fill="currentColor" />
                    <span>{isDrawing ? "MIXING..." : "DRAW"}</span>
                </button>

                <button
                    onClick={() => {
                        resetGame();
                        window.location.reload();
                    }}
                    className={cn("reset-button active:scale-95")}
                >
                    <RotateCcw size={20} />
                    <span>RESET</span>
                </button>
            </div>
        </div>
    );
}
