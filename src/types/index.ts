/**
 * 게임의 전반적인 상태 타입 정의
 */
export type GameStatus = "idle" | "mixing" | "result";

/**
 * 당첨자 정보 타입 (나중에 날짜나 팀명을 추가할 수도 있으니 객체로 확장 가능하게 고려)
 */
export interface Participant {
    id: string;
    name: string;
}

/**
 * 사운드 타입 정의
 */
export type SoundType = "roll" | "win" | "click";

/**
 * 스토어(Store)에서 사용하는 상태 인터페이스
 */
export interface GameState {
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
    loadStorage: () => void;
}
