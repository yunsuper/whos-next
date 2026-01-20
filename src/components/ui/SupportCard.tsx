"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function SupportCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={cn(
                "p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm",
                "flex flex-col items-center text-center gap-4",
            )}
        >
            <div className="space-y-1">
                <h3 className="text-yellow-400 font-bold tracking-tight">
                    커피 한 잔의 응원
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">                 
                    개발자에게 따뜻한 커피 한 잔을 선물해주세요!
                </p>
            </div>

            {/* QR 코드 영역 */}
            <div className="relative p-2 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Image
                    src="/kakao-qr.png" // public 폴더에 넣은 파일명과 일치해야 함
                    alt="Kakao Support QR"
                    width={140}
                    height={140}
                    className="rounded-lg"
                />
            </div>

            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                Thank you for your support
            </span>
        </motion.div>
    );
}
