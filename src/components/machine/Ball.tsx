import Matter from "matter-js";
import { truncateText } from "@/lib/utils";

export const BALL_COLORS = [
    "#FACC15", 
    "#60A5FA", 
    "#F87171", 
    "#4ADE80", 
    "#A78BFA", 
];

/**
 * Matter.js 공 객체를 생성하는 유틸리티
 */
export const createBall = (
    x: number,
    y: number,
    name: string,
    index: number,
) => {
    return Matter.Bodies.circle(x, y, 18, {
        restitution: 0.8,
        friction: 0.01,
        label: name,
        render: {
            fillStyle: BALL_COLORS[index % BALL_COLORS.length],
            strokeStyle: "rgba(255,255,255,0.5)",
            lineWidth: 3,
        },
    });
};

/**
 * 캔버스 위에 공의 이름을 그리는 유틸리티
 */
export const drawBallName = (
    context: CanvasRenderingContext2D,
    body: Matter.Body,
) => {
    context.save();
    context.translate(body.position.x, body.position.y);
    context.rotate(body.angle);

    context.font = "bold 12px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#ffffff";

    const displayName = truncateText(body.label, 5);
    context.fillText(displayName, 0, 0);

    context.restore();
};
