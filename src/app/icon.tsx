// src/app/icon.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        <div
            style={{
                fontSize: 22,
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", 
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px", 
                color: "#1e293b", 
                fontWeight: 900,
                border: "2px solid rgba(255, 255, 255, 0.3)", 
            }}
        >
            7
        </div>,
        { ...size },
    );
}
