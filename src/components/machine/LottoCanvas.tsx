"use client";

import { useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useAudio } from "@/hooks/useAudio";
import { useMatter } from "@/hooks/useMatter";

export default function LottoCanvas() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const { participants, isDrawing } = useGameStore();
    const { playSound } = useAudio();

    useMatter({ sceneRef, participants, isDrawing, playSound });

    return (
        <div className="lotto-machine-wrapper">
            <div className="lotto-canvas-container">
                <div className="lotto-outer-ring" />
                <div ref={sceneRef} className="lotto-canvas-bg" />
                <div className="glass-sheen" />
                <div className="glass-rim-light" />
                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-blue-500/5 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
