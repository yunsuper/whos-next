"use client";

import confetti from "canvas-confetti";

export const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 200, 
    };

    const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // 다양한 위치에서 터지는 효과
        confetti({
            ...defaults,
            particleCount,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
            // yunsuper님 머신 디자인에 어울리는 골드 & 화이트 & 오렌지 톤
            colors: ["#FACC15", "#FB923C", "#FFFFFF", "#F59E0B"],
        });
    }, 250);
};
