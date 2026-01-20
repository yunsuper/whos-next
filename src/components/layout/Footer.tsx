"use client";

import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="footer-container">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
            >
                <div className="footer-brand">
                    Designed & Built by
                    <span className="footer-name">yunsuper</span>
                </div>
                <p className="footer-copy">
                    &copy; {new Date().getFullYear()} All Rights Reserved.
                </p>

                {/* 하단에 아주 미세한 레드 라인 포인트 (시스템 활성 느낌) */}
                <div className="w-8 h-1px bg-red-500/30 mt-4 shadow-[0_0_8px_#ef4444]" />
            </motion.div>
        </footer>
    );
}
