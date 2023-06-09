const handlers: {
    name: string;
    handler: (
        data: string[][],
        newRow: number,
        newCol: number,
        column: number,
        row: number,
        chess: string,
        setp: number
    ) => { nextChess: string; newWinner?: string };
    init: () => { nextChess: string };
}[] = [
    {
        // 三连子游戏
        name: 'tictactoe',
        handler: (
            data: string[][],
            newRow: number,
            newCol: number,
            column: number,
            row: number,
            chess: string,
            step: number
        ) => {
            // 下棋
            const newChess = data[newRow][newCol];
            const returns = { nextChess: '', newWinner: '' };
            let isWin = false;
            const dir = [
                [
                    [1, 0],
                    [-1, 0],
                ],
                [
                    [0, 1],
                    [0, -1],
                ],
                [
                    [1, 1],
                    [-1, -1],
                ],
                [
                    [1, -1],
                    [-1, 1],
                ],
            ];
            for (const d of dir) {
                let count = 1;
                for (const dd of d) {
                    let x = newCol + dd[0];
                    let y = newRow + dd[1];
                    while (x >= 0 && x < column && y >= 0 && y < row && data[y][x] === newChess) {
                        x += dd[0];
                        y += dd[1];
                        count++;
                        if (count >= 3) {
                            isWin = true;
                            break;
                        }
                    }
                }
            }
            // 判断胜者
            if (isWin) {
                returns.newWinner = chess;
            } else {
                // 判断平局
                if (step === column * row - 1) {
                    returns.newWinner = '平局';
                }
                // 更新下一颗棋子
                if (chess === 'X') {
                    returns.nextChess = 'O';
                } else if (chess === 'O') {
                    returns.nextChess = 'X';
                }
            }
            return returns;
        },
        init: () => {
            return { nextChess: 'X' };
        },
    },
    {
        // 五子棋游戏
        name: 'gomoku',
        handler: (
            data: string[][],
            newRow: number,
            newCol: number,
            column: number,
            row: number,
            chess: string,
            setp: number
        ) => {
            // 下棋
            const newChess = data[newRow][newCol];
            const returns = { nextChess: '', newWinner: '' };
            let isWin = false;
            const dir = [
                [
                    [1, 0],
                    [-1, 0],
                ],
                [
                    [0, 1],
                    [0, -1],
                ],
                [
                    [1, 1],
                    [-1, -1],
                ],
                [
                    [1, -1],
                    [-1, 1],
                ],
            ];
            for (const d of dir) {
                let count = 1;
                for (const dd of d) {
                    let x = newCol + dd[0];
                    let y = newRow + dd[1];
                    while (x >= 0 && x < column && y >= 0 && y < row && data[y][x] === newChess) {
                        x += dd[0];
                        y += dd[1];
                        count++;
                        if (count >= 5) {
                            isWin = true;
                            break;
                        }
                    }
                    if (isWin) break;
                }
                if (isWin) break;
            }
            // 判断胜者
            if (isWin) {
                returns.newWinner = chess;
            } else {
                // 判断平局
                if (setp === column * row - 1) {
                    returns.newWinner = '平局';
                }
                // 更新下一颗棋子
                if (chess === '⚫') {
                    returns.nextChess = '⚪';
                } else if (chess === '⚪') {
                    returns.nextChess = '⚫';
                }
            }
            return returns;
        },
        init: () => {
            return { nextChess: '⚫' };
        },
    },
];

export default handlers;
