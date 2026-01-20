import { ImageResponse } from "next/og";

export const runtime = "edge";

// 모바일 홈 화면 아이콘 표준 사이즈 (180x180)
export const size = {
    width: 180,
    height: 180,
};
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        <div
            style={{
                fontSize: 120,
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "40px", 
                color: "#1e293b",
                fontWeight: 900,
                border: "4px solid rgba(255, 255, 255, 0.2)",
            }}
        >
            7
        </div>,
        {
            ...size,
        },
    );
}
