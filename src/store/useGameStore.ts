import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { GameState } from "@/types";

/**
 * Zustand Persist 미들웨어를 사용하여 로컬스토리지와 자동 동기화되는 스토어입니다.
 * 이제 storage.set을 수동으로 호출할 필요가 없습니다.
 */
export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            participants: [],
            winners: [],
            history: [],
            isDrawing: false,

            loadStorage: () => {},

            addParticipant: (name: string) =>
                set((state) => ({
                    participants: [...state.participants, name],
                })),

            removeParticipant: (index: number) =>
                set((state) => ({
                    participants: state.participants.filter(
                        (_, i) => i !== index,
                    ),
                })),

            setIsDrawing: (isDrawing: boolean) => set({ isDrawing }),

            setWinners: (winners: string[]) => set({ winners }),

            addToHistory: (winner: string) =>
                set((state) => ({
                    history: [...state.history, winner],
                })),

            resetGame: () =>
                set({
                    participants: [],
                    winners: [],
                    history: [],
                    isDrawing: false,
                }),

            pickWinner: (winnerName: string) =>
                set((state) => ({
                    participants: state.participants.filter(
                        (p) => p !== winnerName,
                    ),
                    history: [...state.history, winnerName],
                })),
        }),
        {
            name: "lucky-draw-storage",
            storage: createJSONStorage(() => localStorage),
            // 저장할 데이터만 골라냅니다.
            // isDrawing 같은 일시적인 상태는 저장하지 않도록 설정.
            partialize: (state) => ({
                participants: state.participants,
                history: state.history,
            }),
        },
    ),
);
