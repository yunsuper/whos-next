import { ImageResponse } from "next/og";

export const alt = "WHO'S NEXT? | 제비뽑기 추첨기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        <div
            style={{
                background: "linear-gradient(to bottom, #0f172a, #1e293b)",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
            }}
        >
            <div style={{ fontSize: 80, fontWeight: "bold", marginBottom: 20 }}>
                {`🎰 WHO'S NEXT?`}
            </div>
            <div style={{ fontSize: 30, color: "#94a3b8" }}>
                공정한 랜덤 추첨, 지금 바로 돌려보세요!
            </div>
        </div>,
        { ...size },
    );
}
