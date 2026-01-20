"use client";

import React, { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Plus, Play, RotateCcw, Trash2 } from "lucide-react";
import { useAudio } from "@/hooks/useAudio"; // 사운드 추가

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
        playSound("click"); // 시작 시 세련된 틱 소리
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
        <div className="control-panel">
            {/* 입력 섹션 */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="팀 이름이나 참가자 입력"
                    className="input-field"
                />
                <button
                    onClick={handleAdd}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-lg transition-colors"
                >
                    <Plus />
                </button>
            </div>

            {/* 리스트 섹션 */}
            <div className="space-y-2 max-h-48 overflow-y-auto mb-6 custom-scrollbar">
                {participants.map((p, idx) => (
                    <div key={`${p}-${idx}`} className="participant-item">
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

            {/* 하단 버튼 섹션 */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={handleDraw}
                    disabled={participants.length === 0 || isDrawing}
                    className={`draw-button ${isDrawing ? "draw-button-mixing" : "draw-button-active"} disabled:opacity-50`}
                >
                    <Play size={20} fill="currentColor" />
                    {isDrawing ? "MIXING..." : "DRAW"}
                </button>

                <button
                    onClick={() => {
                        resetGame();
                        window.location.reload();
                    }}
                    className="reset-button"
                >
                    <RotateCcw size={20} />
                    RESET
                </button>
            </div>
        </div>
    );
}
