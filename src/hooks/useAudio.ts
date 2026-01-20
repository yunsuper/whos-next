"use client";

/**
 * 전역 변수로 AudioContext를 관리하여 메모리 누수와
 * "AudioContext encountered 한도 초과" 에러를 방지합니다.
 */
let sharedAudioCtx: AudioContext | null = null;

export const useAudio = () => {
    /**
     * 오디오 컨텍스트 초기화 및 재사용 로직
     */
    const initAudio = () => {
        if (!sharedAudioCtx) {
            const AudioContextClass =
                window.AudioContext ||
                (
                    window as unknown as {
                        webkitAudioContext: typeof AudioContext;
                    }
                ).webkitAudioContext;

            if (AudioContextClass) {
                sharedAudioCtx = new AudioContextClass();
            }
        }

        // 브라우저가 사용자 인터랙션 부족으로 오디오를 정지시킨 경우 다시 시작
        if (sharedAudioCtx?.state === "suspended") {
            sharedAudioCtx.resume();
        }

        return sharedAudioCtx;
    };

    const playSound = (type: "roll" | "win" | "click") => {
        const ctx = initAudio();
        if (!ctx) return;

        // 메인 사운드 발생을 위한 기본 설정
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === "roll") {
            // 공이 섞이는 '달그락' 소리 (사인파)
            osc.type = "sine";
            osc.frequency.setValueAtTime(
                Math.random() * 100 + 150,
                ctx.currentTime,
            );
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } else if (type === "win") {
            // 당첨 팡파르 (화음 합성) - 독립적인 오실레이터 생성
            const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
            notes.forEach((freq, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = "triangle";
                o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
                g.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
                g.gain.exponentialRampToValueAtTime(
                    0.01,
                    ctx.currentTime + i * 0.1 + 0.5,
                );
                o.connect(g);
                g.connect(ctx.destination);
                o.start(ctx.currentTime + i * 0.1);
                o.stop(ctx.currentTime + i * 0.1 + 0.5);
            });
        } else if (type === "click") {
            // 부드러운 사인파 사용
            osc.type = "sine";
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(
                400,
                ctx.currentTime + 0.03,
            );

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(
                0.01,
                ctx.currentTime + 0.03,
            );

            osc.start();
            osc.stop(ctx.currentTime + 0.03);
        }
    };

    return { playSound };
};
