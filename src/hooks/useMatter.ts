"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { SoundType } from "@/types";
import { createBall, drawBallName } from "@/components/machine/Ball";

interface UseMatterProps {
    sceneRef: React.RefObject<HTMLDivElement | null>;
    participants: string[];
    isDrawing: boolean;
    playSound: (type: SoundType) => void;
}

export const useMatter = ({
    sceneRef,
    participants,
    isDrawing,
    playSound,
}: UseMatterProps) => {
    const engineRef = useRef(Matter.Engine.create());
    const requestRef = useRef<number | null>(null);
    const lastBallsCount = useRef(0);

    const FIXED_SIZE = 400;
    const CENTER = 200;
    const RADIUS = 190;

    useEffect(() => {
        if (!sceneRef.current) return;

        const engine = engineRef.current;
        engine.gravity.y = 1.2;

        const render = Matter.Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: FIXED_SIZE,
                height: FIXED_SIZE,
                wireframes: false,
                background: "transparent",
            },
        });

        // 1. 원형 벽 생성
        const wallThickness = 100;
        for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * Math.PI * 2;
            const x = CENTER + Math.cos(angle) * (RADIUS + wallThickness / 2);
            const y = CENTER + Math.sin(angle) * (RADIUS + wallThickness / 2);
            const wall = Matter.Bodies.rectangle(x, y, wallThickness, 40, {
                isStatic: true,
                angle: angle,
                render: { visible: false },
                friction: 0.05,
                restitution: 0.5,
            });
            Matter.World.add(engine.world, wall);
        }

        // 2. 렌더링 이벤트 (공 이름 그리기 및 탈출 방지)
        Matter.Events.on(render, "afterRender", () => {
            const context = render.context;
            const bodies = Matter.Composite.allBodies(engine.world);

            bodies.forEach((body) => {
                // 원형 벽(Rectangle Body)이 아닌 공 객체만 처리
                if (body.label && body.label !== "Rectangle Body") {
                    const dx = body.position.x - CENTER;
                    const dy = body.position.y - CENTER;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // 탈출 방지 로직
                    if (distance > RADIUS + 20) {
                        Matter.Body.setPosition(body, { x: CENTER, y: 120 });
                        Matter.Body.setVelocity(body, { x: 0, y: 1 });
                    }

                    // [Ball.ts 유틸리티 사용]
                    drawBallName(context, body);
                }
            });
        });

        const update = () => {
            Matter.Engine.update(engine, 1000 / 60);
            requestRef.current = requestAnimationFrame(update);
        };

        Matter.Render.run(render);
        requestRef.current = requestAnimationFrame(update);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            Matter.Render.stop(render);
            Matter.Engine.clear(engine);
            render.canvas.remove();
        };
    }, [sceneRef]);

    // 3. 참가자 명단 변경 시 공 추가/제거
    useEffect(() => {
        const engine = engineRef.current;
        const world = engine.world;
        const currentBodies = Matter.Composite.allBodies(world);

        // 제거된 참가자 공 삭제
        currentBodies.forEach((body) => {
            if (
                body.label &&
                body.label !== "Rectangle Body" &&
                !participants.includes(body.label)
            ) {
                Matter.World.remove(world, body);
            }
        });

        // 새 참가자 공 추가
        if (participants.length > lastBallsCount.current) {
            const diff = participants.length - lastBallsCount.current;
            for (let i = 0; i < diff; i++) {
                const name = participants[lastBallsCount.current + i];

                // [Ball.ts 유틸리티 사용]
                const ball = createBall(
                    CENTER + (Math.random() * 20 - 10),
                    100,
                    name,
                    lastBallsCount.current + i,
                );

                Matter.Body.setVelocity(ball, { x: 0, y: 2 });
                Matter.World.add(world, ball);
            }
        }
        lastBallsCount.current = participants.length;
    }, [participants]);

    // 4. 추첨(Mixing) 물리 효과
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isDrawing) {
            interval = setInterval(() => {
                const bodies = Matter.Composite.allBodies(
                    engineRef.current.world,
                );
                const activeBalls = bodies.filter((b) => !b.isStatic);

                if (activeBalls.length > 0) playSound("roll");

                bodies.forEach((body) => {
                    if (!body.isStatic) {
                        Matter.Body.applyForce(body, body.position, {
                            x: (Math.random() - 0.5) * 0.04,
                            y: (Math.random() - 0.5) * 0.06,
                        });
                    }
                });
            }, 150);
        }
        return () => clearInterval(interval);
    }, [isDrawing, playSound]);
};
