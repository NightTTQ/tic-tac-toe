import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from '@/App';
const TicTacToe = lazy(() => import('@/components/board'));

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/tictactoe',
                element: (
                    <TicTacToe
                        updateGameState={function () {
                            throw new Error('Function not implemented.');
                        }}
                        gameState={[]}
                    />
                ),
            },
        ],
    },
]);
