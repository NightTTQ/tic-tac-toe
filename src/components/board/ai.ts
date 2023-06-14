import handlers from './handlers';

/**
 * @desc 能够判断胜负的handler
 */
const handler = handlers.filter((item) => item.name === 'tictactoe')[0]
    ?.handler;
/**
 * @desc 评价函数
 * @param data 当前棋盘数据
 * @param curChess 当前落子方
 * @param otherChess 另一落子方
 * @param preferChess 求胜落子方
 * @param column 棋盘列数
 * @param row 棋盘行数
 * @param newRow 新落子行
 * @param newCol 新落子列
 * @param step 当前步数
 */
const evaluate = (
    data: string[][],
    curChess: string,
    otherChess: string,
    preferChess: string,
    column: number,
    row: number,
    newRow: number,
    newCol: number,
    step: number
): number => {
    if (!handler) return 0;
    const { newWinner } = handler(
        data,
        newRow,
        newCol,
        column,
        row,
        curChess,
        step
    );
    if (newWinner === preferChess) return 1;
    if (
        newWinner !== preferChess &&
        (newWinner === curChess || newWinner === otherChess)
    ) return -1;
    return 0;
};

/**
 * @desc minmax算法
 * @param data 棋盘数据
 * @param curChess 当前落子方
 * @param nextChess 下一落子方
 * @param preferChess 求胜落子方
 * @param column 棋盘列数
 * @param row 棋盘行数
 * @param newRow 新落子行
 * @param newCol 新落子列
 * @param step 当前步数
 * @param isMax 此步是否需要选最大值
 * @param depth 剩余搜索深度（-1为不限制）
 */
const minmax = (
    data: string[][],
    curChess: string,
    nextChess: string,
    preferChess: string,
    column: number,
    row: number,
    newRow: number,
    newCol: number,
    step: number,
    isMax: boolean,
    depth: number,
    alpha: number,
    beta: number
): number => {
    // 先计算当前步数的评价值
    const score = evaluate(
        data,
        curChess,
        nextChess,
        preferChess,
        column,
        row,
        newRow,
        newCol,
        step
    );
    // 有胜者/抵达深度限制/平局，都认为搜索结束，返回评价值
    if (score !== 0 || depth === 0 || step === column * row) return score;
    // 未结束
    if (isMax) {
        // 当前步会选最大值
        let maxScore = -Infinity;
        for (let yIndex = 0; yIndex < row; yIndex++) {
            for (let xIndex = 0; xIndex < column; xIndex++) {
                if (data[yIndex][xIndex] === '') {
                    // 当前位置为空，落下一颗棋子
                    data[yIndex][xIndex] = nextChess;
                    // 计算当前落子的评价值
                    maxScore = Math.max(
                        maxScore,
                        minmax(
                            data,
                            nextChess,
                            curChess,
                            preferChess,
                            column,
                            row,
                            yIndex,
                            xIndex,
                            step + 1,
                            !isMax,
                            depth >= 0 ? depth - 1 : -1,
                            alpha,
                            beta
                        )
                    );
                    data[yIndex][xIndex] = '';
                    // alpha剪枝
                    alpha = Math.max(alpha, maxScore);
                    if (beta <= alpha) break;
                }
            }
        }
        return maxScore;
    }
    // 当前步会选最小值
    let minScore = Infinity;
    for (let yIndex = 0; yIndex < row; yIndex++) {
        for (let xIndex = 0; xIndex < column; xIndex++) {
            if (data[yIndex][xIndex] === '') {
                // 当前位置为空，落下一颗棋子
                data[yIndex][xIndex] = nextChess;
                // 计算当前位置的评价值
                minScore = Math.min(
                    minScore,
                    minmax(
                        data,
                        nextChess,
                        curChess,
                        preferChess,
                        column,
                        row,
                        yIndex,
                        xIndex,
                        step + 1,
                        !isMax,
                        depth >= 0 ? depth - 1 : -1,
                        alpha,
                        beta
                    )
                );
                data[yIndex][xIndex] = '';
                // beta剪枝
                beta = Math.min(beta, minScore);
                if (beta <= alpha) break;
            }
        }
    }
    return minScore;
};

/**
 * @desc 计算最佳落子位置
 * @param data 当前棋盘数据，给过来之前已经经过handler处理过，保证目前没有胜者
 * @param myChess 当前落子方
 * @param yourChess 对方落子方
 * @param column 棋盘列数
 * @param row 棋盘行数
 * @param step 已走的步数
 */
const aiGo = (
    data: string[][],
    myChess: string,
    yourChess: string,
    column: number,
    row: number,
    step: number
): { newRow: number, newCol: number } => {
    let newRow = 0;
    let newCol = 0;
    let maxScore = -Infinity;
    for (let yIndex = 0; yIndex < row; yIndex++) {
        for (let xIndex = 0; xIndex < column; xIndex++) {
            if (data[yIndex][xIndex] === '') {
                // 当前位置为空，可以落子
                data[yIndex][xIndex] = myChess;
                // 计算当前位置的评价值
                const score = minmax(
                    data,
                    myChess,
                    yourChess,
                    myChess,
                    column,
                    row,
                    yIndex,
                    xIndex,
                    step + 1,
                    false,
                    -1,
                    -Infinity,
                    Infinity
                );
                if (score > maxScore) {
                    maxScore = score;
                    newRow = yIndex;
                    newCol = xIndex;
                }
                data[yIndex][xIndex] = '';
            }
        }
    }
    return { newRow, newCol };
};

export { aiGo };
