import { create } from "zustand";

interface GameState {
    participants: string[];
    winners: string[];
    history: string[];
    isDrawing: boolean;
    addParticipant: (name: string) => void;
    removeParticipant: (index: number) => void;
    setIsDrawing: (isDrawing: boolean) => void;
    setWinners: (winners: string[]) => void;
    addToHistory: (winner: string) => void;
    resetGame: () => void;
    pickWinner: (winnerName: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
    participants: [],
    winners: [],
    history: [],
    isDrawing: false,
    addParticipant: (name) =>
        set((state) => ({ participants: [...state.participants, name] })),
    removeParticipant: (index) =>
        set((state) => ({
            participants: state.participants.filter((_, i) => i !== index),
        })),
    setIsDrawing: (isDrawing) => set({ isDrawing }),
    setWinners: (winners) => set({ winners }),
    // 확실하게 이전 상태를 복사해서 추가
    addToHistory: (winner) =>
        set((state) => ({
            history: [...state.history, winner],
        })),
    resetGame: () =>
        set({ participants: [], winners: [], history: [], isDrawing: false }),
    pickWinner: (winnerName: string) =>
        set((state) => ({
            // 당첨자를 제외한 나머지만 유지
            participants: state.participants.filter((p) => p !== winnerName),
            // 히스토리에 추가
            history: [...state.history, winnerName],
        })),
}));
