"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { useGameStore } from "@/store/useGameStore";

export default function LottoCanvas() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef(Matter.Engine.create());
    const requestRef = useRef<number | null>(null);
    const { participants, isDrawing } = useGameStore();
    const lastBallsCount = useRef(0);

    useEffect(() => {
        if (!sceneRef.current) return;

        const engine = engineRef.current;
        engine.gravity.y = 1.2;

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

        // 1. 원형 벽 생성 (벽 두께를 40 -> 100으로 늘려 탈출 차단)
        const centerX = 200;
        const centerY = 200;
        const radius = 190;
        const wallThickness = 100; // 두꺼운 벽으로 공이 뚫지 못하게 설정

        for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * (radius + wallThickness / 2);
            const y = centerY + Math.sin(angle) * (radius + wallThickness / 2);

            const wall = Matter.Bodies.rectangle(x, y, wallThickness, 40, {
                isStatic: true,
                angle: angle,
                render: { visible: false },
                friction: 0.05,
                restitution: 0.5, // 벽에 부딪힐 때 적절한 탄성
            });
            Matter.World.add(engine.world, wall);
        }

        Matter.Events.on(render, "afterRender", () => {
            const context = render.context;
            context.font = "bold 12px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = "#ffffff";

            const bodies = Matter.Composite.allBodies(engine.world);
            bodies.forEach((body) => {
                if (body.label && body.label !== "Rectangle Body") {
                    // [안전장치] 공이 화면 밖(좌표 0~400 사이가 아님)으로 나가면 중앙으로 강제 소환
                    if (
                        body.position.x < 0 ||
                        body.position.x > 400 ||
                        body.position.y < 0 ||
                        body.position.y > 400
                    ) {
                        Matter.Body.setPosition(body, { x: 200, y: 150 });
                        Matter.Body.setVelocity(body, { x: 0, y: 2 });
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
    }, []);

    // 공 추가 및 삭제 동기화 로직
    useEffect(() => {
        const engine = engineRef.current;
        const world = engine.world;
        const currentBodies = Matter.Composite.allBodies(world);

        currentBodies.forEach((body) => {
            if (body.label && body.label !== "Rectangle Body") {
                if (!participants.includes(body.label)) {
                    Matter.World.remove(world, body);
                }
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

                // 공이 벽 안에 생성되도록 y좌표를 100으로 살짝 아래로 조정
                const ball = Matter.Bodies.circle(
                    200 + (Math.random() * 20 - 10),
                    100,
                    20,
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
                Matter.Body.setVelocity(ball, {
                    x: Math.random() * 2 - 1,
                    y: 3,
                });
                Matter.World.add(world, ball);
            }
        }
        lastBallsCount.current = participants.length;
    }, [participants]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isDrawing) {
            interval = setInterval(() => {
                const bodies = Matter.Composite.allBodies(
                    engineRef.current.world,
                );
                bodies.forEach((body) => {
                    if (!body.isStatic) {
                        Matter.Body.applyForce(body, body.position, {
                            x: (Math.random() - 0.5) * 0.04, // 힘을 너무 강하지 않게 조절하여 탈출 방지
                            y: (Math.random() - 0.5) * 0.06,
                        });
                    }
                });
            }, 20);
        }
        return () => clearInterval(interval);
    }, [isDrawing]);

    return (
        <div className="relative">
            <div className="absolute inset-0 rounded-full border-10 border-slate-800 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] z-20 pointer-events-none" />
            <div
                ref={sceneRef}
                className="w-100 h-100 bg-slate-900/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/10"
            />
        </div>
    );
}
