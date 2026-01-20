"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

interface UseMatterProps {
    sceneRef: React.RefObject<HTMLDivElement | null>;
    participants: string[];
    isDrawing: boolean;
    playSound: (type: "roll" | "win" | "click") => void;
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

    useEffect(() => {
        if (!sceneRef.current) return;

        const engine = engineRef.current;
        // 모바일에서 공이 너무 무겁게 느껴지지 않도록 중력 미세 조정
        engine.gravity.y = 1.0;

        const render = Matter.Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: 400,
                height: 400,
                wireframes: false,
                background: "transparent",
            },
        });

        // 1. 원형 벽 생성 (반지름 190 고정)
        const centerX = 200,
            centerY = 200,
            radius = 190,
            wallThickness = 100;

        for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * (radius + wallThickness / 2);
            const y = centerY + Math.sin(angle) * (radius + wallThickness / 2);
            const wall = Matter.Bodies.rectangle(x, y, wallThickness, 40, {
                isStatic: true,
                angle: angle,
                render: { visible: false },
                friction: 0.05,
                restitution: 0.6, // 탄성 살짝 증가
            });
            Matter.World.add(engine.world, wall);
        }

        // 2. 텍스트 렌더링 및 안전장치 (좌표 기반 -> 거리 기반 수정)
        Matter.Events.on(render, "afterRender", () => {
            const context = render.context;
            context.font = "bold 12px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = "#ffffff";

            const bodies = Matter.Composite.allBodies(engine.world);
            bodies.forEach((body) => {
                if (body.label && body.label !== "Rectangle Body") {
                    // [핵심] 중심(200, 200)으로부터 공까지의 거리를 계산
                    const dx = body.position.x - 200;
                    const dy = body.position.y - 200;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // 공이 벽(190)을 넘어가거나 비정상적인 위치에 있으면 중앙 소환
                    if (distance > 185) {
                        Matter.Body.setPosition(body, { x: 200, y: 150 });
                        Matter.Body.setVelocity(body, { x: 0, y: 1 });
                    }

                    context.save();
                    context.translate(body.position.x, body.position.y);
                    context.rotate(body.angle);
                    const displayName =
                        body.label.length > 5
                            ? body.label.substring(0, 4) + ".."
                            : body.label;
                    context.fillText(displayName, 0, 0);
                    context.restore();
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

    // 공 추가 및 삭제 동기화
    useEffect(() => {
        const engine = engineRef.current;
        const world = engine.world;
        const currentBodies = Matter.Composite.allBodies(world);

        currentBodies.forEach((body) => {
            if (
                body.label &&
                body.label !== "Rectangle Body" &&
                !participants.includes(body.label)
            ) {
                Matter.World.remove(world, body);
            }
        });

        if (participants.length > lastBallsCount.current) {
            const diff = participants.length - lastBallsCount.current;
            for (let i = 0; i < diff; i++) {
                const name = participants[lastBallsCount.current + i];
                const color = [
                    "#FACC15",
                    "#60A5FA",
                    "#F87171",
                    "#4ADE80",
                    "#A78BFA",
                ][(lastBallsCount.current + i) % 5];

                // 공의 반지름을 20 -> 18로 살짝 줄여서 모달/모바일 가독성 확보
                const ball = Matter.Bodies.circle(
                    200 + (Math.random() * 10 - 5),
                    120, // 생성 위치를 조금 더 아래로 안정화
                    18,
                    {
                        restitution: 0.8,
                        friction: 0.01,
                        label: name,
                        render: {
                            fillStyle: color,
                            strokeStyle: "rgba(255,255,255,0.5)",
                            lineWidth: 3,
                        },
                    },
                );
                Matter.Body.setVelocity(ball, { x: 0, y: 2 });
                Matter.World.add(world, ball);
            }
        }
        lastBallsCount.current = participants.length;
    }, [participants]);

    // 섞기 로직
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
                            // 모바일 scale을 고려해 힘을 살짝 약하게 조정 (탈출 방지)
                            x: (Math.random() - 0.5) * 0.035,
                            y: (Math.random() - 0.5) * 0.055,
                        });
                    }
                });
            }, 150);
        }
        return () => clearInterval(interval);
    }, [isDrawing, playSound]);
};
