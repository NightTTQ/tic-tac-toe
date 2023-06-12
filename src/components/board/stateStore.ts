import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type GameState = {
    data: string[][];
    nextChess: string;
    curRow?: number;
    curCol?: number;
    winner?: string;
}[];

const initialState: { value: GameState } = { value: [] };

export const gameState = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        updateGameState: (state, action: PayloadAction<GameState>) => {
            state.value = action.payload;
        },
    },
});

export const { updateGameState } = gameState.actions;

export default gameState.reducer;
