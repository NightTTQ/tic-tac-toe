/**
 * @desc 生成连子游戏handler
 * @param winCount 获胜所需连子数
 * @param firstChess 先手棋子
 * @param secondChess 后手棋子
 */
const universalHandler =
    (winCount: number, firstChess: string, secondChess: string) =>
        (
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
            for (const dr of dir) {
                let count = 1;
                for (const ddr of dr) {
                    let xIndex = newCol + ddr[0];
                    let yIndex = newRow + ddr[1];
                    while (
                        xIndex >= 0 &&
                    xIndex < column &&
                    yIndex >= 0 &&
                    yIndex < row &&
                    data[yIndex][xIndex] === newChess
                    ) {
                        xIndex += ddr[0];
                        yIndex += ddr[1];
                        count++;
                        if (count >= winCount) {
                            isWin = true;
                            break;
                        }
                    }
                }
            }
            // 判断胜者
            if (isWin) returns.newWinner = chess;
            else {
            // 判断平局
                if (step === (column * row) - 1) returns.newWinner = '平局';
                // 更新下一颗棋子
                if (chess === firstChess) returns.nextChess = secondChess;
                else if (chess === secondChess) returns.nextChess = firstChess;
            }
            return returns;
        };
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
    ) => { nextChess: string, newWinner?: string };
    init: () => { nextChess: string };
}[] = [
    {
        // 三连子游戏
        name: 'tictactoe',
        handler: universalHandler(3, 'X', 'O'),
        init: () => ({ nextChess: 'X' }),
    },
    {
        // 五子棋游戏
        name: 'gomoku',
        handler: universalHandler(5, '⚫', '⚪'),
        init: () => ({ nextChess: '⚫' }),
    },
];

export default handlers;
