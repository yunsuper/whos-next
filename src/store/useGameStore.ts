import { create } from "zustand";
import { GameState } from "@/types";
import { storage } from "@/lib/utils";

export const useGameStore = create<GameState>((set) => ({
    // 서버와의 초기 HTML 일치를 위해 초기값은 빈 배열로 고정합니다.
    participants: [],
    winners: [],
    history: [],
    isDrawing: false,

    loadStorage: () => {
        const savedParticipants = storage.get<string[]>("participants") || [];
        const savedHistory = storage.get<string[]>("history") || [];
        set({
            participants: savedParticipants,
            history: savedHistory,
        });
    },

    addParticipant: (name: string) =>
        set((state) => {
            const newList = [...state.participants, name];
            storage.set("participants", newList);
            return { participants: newList };
        }),

    removeParticipant: (index: number) =>
        set((state) => {
            const newList = state.participants.filter((_, i) => i !== index);
            storage.set("participants", newList);
            return { participants: newList };
        }),

    setIsDrawing: (isDrawing: boolean) => set({ isDrawing }),

    setWinners: (winners: string[]) => set({ winners }),

    addToHistory: (winner: string) =>
        set((state) => {
            const newHistory = [...state.history, winner];
            storage.set("history", newHistory);
            return { history: newHistory };
        }),

    resetGame: () => {
        // 리셋 시 스토리지도 비워줌
        storage.set("participants", []);
        storage.set("history", []);
        set({ participants: [], winners: [], history: [], isDrawing: false });
    },

    pickWinner: (winnerName: string) =>
        set((state) => {
            const newParticipants = state.participants.filter(
                (p) => p !== winnerName,
            );
            const newHistory = [...state.history, winnerName];

            // 변경된 데이터 모두 저장
            storage.set("participants", newParticipants);
            storage.set("history", newHistory);

            return {
                participants: newParticipants,
                history: newHistory,
            };
        }),
}));
