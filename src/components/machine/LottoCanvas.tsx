"use client";

import { useRef } from "react";
import { useMatter } from "@/hooks/useMatter";
import { useGameStore } from "@/store/useGameStore";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils"; // 유틸리티 추가

export default function LottoCanvas() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const { participants, isDrawing } = useGameStore();
    const { playSound } = useAudio();

    useMatter({ sceneRef, participants, isDrawing, playSound });

    return (
        // cn을 사용하여 커스텀 유틸리티 클래스 적용
        <div className={cn("lotto-canvas-container")}>
            {/* 외부 테두리 링 */}
            <div className={cn("lotto-outer-ring")} />

            {/* 실제 물리 엔진이 렌더링될 배경 */}
            <div className={cn("lotto-canvas-bg")}>
                <div ref={sceneRef} className="w-full h-full" />

                {/* 유리 반사광 효과들 */}
                <div className={cn("glass-sheen")} />
                <div className={cn("glass-rim-light")} />
            </div>
        </div>
    );
}
