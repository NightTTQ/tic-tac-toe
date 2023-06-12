import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Props } from './index';

export type GameState = {
    data: string[][];
    nextChess: string;
    curRow?: number;
    curCol?: number;
    winner?: string;
};

export const gameState = createSlice({
    name: 'gameState',
    initialState: { value: [] as GameState[] },
    reducers: {
        updateGameState: (state, action: PayloadAction<GameState[]>) => {
            state.value = action.payload;
        },
    },
});

/**
 * @desc 更新游戏状态
 */
export const updateGameState = (gameState: GameState[]) => ({
    type: 'gameState/updateGameState',
    payload: gameState,
});

/**
 * @desc 获取游戏状态
 */
export const mapState = (
    state: { gameState: { value: GameState[] } },
    ownProps: Props
) => {
    return {
        ...ownProps,
        gameState: state.gameState.value,
    };
};
export const mapDispatch = { updateGameState };

export default gameState.reducer;
