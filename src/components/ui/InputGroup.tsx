"use client";

import React, { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Plus, Play, RotateCcw, Trash2 } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils";
import IconButton from "./IconButton";

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
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="팀 이름이나 참가자 입력"
                    className={cn("input-field")}
                />
                {/* 1. 추가 버튼 (기본형) */}
                <IconButton
                    icon={Plus}
                    onClick={handleAdd}
                    ariaLabel="참가자 추가"
                />
            </div>

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
                            {/* 2. 삭제 버튼 (danger 변체) */}
                            <IconButton
                                icon={Trash2}
                                iconSize={16}
                                variant="danger"
                                onClick={() => removeParticipant(idx)}
                                ariaLabel={`${p} 삭제`}
                            />
                        </div>
                    ))
                ) : (
                    <div className={cn("history-empty")}>
                        <p className="text-xs" text-slate-300>
                            참가자를 추가해주세요
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* 3. 추첨 버튼 (draw 변체 - CSS의 draw-button 시리즈 자동 적용) */}
                <IconButton
                    icon={Play}
                    variant="draw"
                    isDrawing={isDrawing}
                    onClick={handleDraw}
                    disabled={participants.length === 0 || isDrawing}
                    ariaLabel="추첨 시작"
                >
                    {isDrawing ? "MIXING..." : "DRAW"}
                </IconButton>

                {/* 4. 리셋 버튼 (reset 변체 - CSS의 reset-button 자동 적용) */}
                <IconButton
                    icon={RotateCcw}
                    variant="reset"
                    onClick={() => {
                        resetGame();
                        window.location.reload();
                    }}
                    ariaLabel="게임 초기화"
                >
                    RESET
                </IconButton>
            </div>
        </div>
    );
}
