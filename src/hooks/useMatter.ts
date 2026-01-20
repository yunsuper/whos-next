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

    // 내부 수치는 무조건 400으로 고정 (엔진의 절대 좌표계)
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

        // 1. 원형 벽 생성 (항상 400px 기준)
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

        // 2. 렌더링 및 탈출 방지 (400px 기준 고정)
        Matter.Events.on(render, "afterRender", () => {
            const context = render.context;
            context.font = "bold 12px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = "#ffffff";

            const bodies = Matter.Composite.allBodies(engine.world);
            bodies.forEach((body) => {
                if (body.label && body.label !== "Rectangle Body") {
                    const dx = body.position.x - CENTER;
                    const dy = body.position.y - CENTER;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // 벽 밖으로 나가면 중앙 소환
                    if (distance > RADIUS + 20) {
                        Matter.Body.setPosition(body, { x: CENTER, y: 120 });
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

    // 공 추가 (항상 400px 기준 좌표로 생성)
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
                const ball = Matter.Bodies.circle(
                    CENTER + (Math.random() * 20 - 10),
                    100,
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

    // 섞기 로직 (생략 - 기존과 동일)
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
