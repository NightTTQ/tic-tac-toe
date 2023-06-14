import { Component, MouseEvent } from 'react';
import { connect } from 'react-redux';

import { type GameState, mapState, mapDispatch } from './stateStore';
import Settings from './settings';
import Info from './info';
import Panel from './panel';
import styles from './index.module.css';
import { aiGo } from './ai';
import handlers from './handlers';

export type Props = {
    gameState: GameState[];
    updateGameState: (state: GameState[]) => void;
};
export type State = {
    column: number;
    row: number;
    mode: number;
    winner?: string;
    step: number;
    chess: string;
    withAI: boolean;
};

/**
 * @desc 游戏模块
 */
class Board extends Component<Props, State> {
    constructor (props: Props) {
        super(props);
        this.state = {
            column: 3,
            row: 3,
            mode: 0,
            step: 0,
            chess: '',
            withAI: false,
        };
    }

    /**
     * @desc 初始化游戏
     * @param column 列数
     * @param row 行数
     * @param modeIndex 游戏模式
     * @param withAI 是否开启AI
     * @param isAiFrist AI是否先手
     */
    init = (
        column: number,
        row: number,
        modeIndex: number,
        withAI: boolean,
        isAiFrist?: boolean
    ) => {
        // 初始化棋盘并记录状态
        const data: string[][] = new Array(row)
            .fill(0)
            .map(() => new Array(column).fill(''));
        const { nextChess } = handlers[modeIndex].init();
        this.props.updateGameState([{ data, nextChess }]);
        this.setState(
            {
                column,
                row,
                mode: modeIndex,
                winner: undefined,
                step: 0,
                chess: nextChess,
                withAI,
            },
            () => {
                if (withAI && isAiFrist) {
                    const data = this.props.gameState[0].data.map((line) =>
                        line.map((item) => item));
                    // 开启AI且AI先手，由AI下第一颗棋
                    const { newRow, newCol } = aiGo(
                        data,
                        nextChess,
                        handlers[modeIndex].chessSet[1],
                        column,
                        row,
                        0
                    );
                    this.handleClick(newRow, newCol, true);
                }
            }
        );
    };
    /**
     * @desc 处理下棋事件
     * @param newRow 新棋子所在行
     * @param newCol 新棋子所在列
     * @param isAi 这一步是否是AI下的
     */
    handleClick = (newRow: number, newCol: number, isAi: boolean) => {
        const { data } = this.props.gameState[this.state.step];
        if (this.state.winner) return;
        // 点击已经有棋的格子不处理
        if (data[newRow][newCol]) return;
        // 先给棋盘赋值，再判断是否胜利
        const newData = data.map((line, rowIndex) =>
            line.map((item, columnIndex) => {
                if (rowIndex === newRow) {
                    if (columnIndex === newCol) {
                        return this.state.chess;
                    }
                }
                return item;
            }));
        // 由玩法处理棋盘数据并判断胜利和下颗棋子
        const { nextChess, newWinner } = handlers[this.state.mode].handler(
            newData,
            newRow,
            newCol,
            this.state.column,
            this.state.row,
            this.state.chess,
            this.state.step
        );
        // 可能是一步新棋，也可能是悔棋后的新棋
        if (this.state.step === this.props.gameState.length - 1) {
            this.props.updateGameState([
                ...this.props.gameState,
                {
                    data: newData,
                    nextChess,
                    curRow: newRow,
                    curCol: newCol,
                    winner: newWinner,
                },
            ]);
        } else {
            // 悔棋后的新棋
            this.props.updateGameState([
                ...this.props.gameState.slice(0, this.state.step + 1),
                {
                    data: newData,
                    nextChess,
                    curRow: newRow,
                    curCol: newCol,
                    winner: newWinner,
                },
            ]);
        }
        this.setState(
            (prevState) => {
                return {
                    column: prevState.column,
                    row: prevState.row,
                    mode: prevState.mode,
                    winner: newWinner,
                    step: prevState.step + 1,
                    chess: nextChess,
                    withAI: prevState.withAI,
                };
            },
            (): void => {
                if (this.state.withAI && !isAi) {
                    const data = this.props.gameState[this.state.step].data.map((line) => line.map((item) => item));
                    // 已开启AI，并且刚刚下的一步是玩家下的，调用AI获取最优解
                    const { newRow, newCol } = aiGo(
                        data,
                        nextChess,
                        handlers[this.state.mode].chessSet.filter((item) => item !== nextChess)[0],
                        this.state.column,
                        this.state.row,
                        this.state.step
                    );
                    // AI落子
                    this.handleClick(newRow, newCol, true);
                }
            }
        );
    };

    /**
     * @desc 悔棋
     */
    goback = (event: MouseEvent<HTMLButtonElement>, index: number) => {
        this.setState((prevState) => {
            return {
                column: prevState.column,
                row: prevState.row,
                mode: prevState.mode,
                winner: this.props.gameState[index].winner,
                step: index,
                chess: this.props.gameState[index].nextChess,
                withAI: prevState.withAI,
            };
        });
    };

    render () {
        const { gameState } = this.props;
        const { column, row, winner, chess, step } = this.state;

        return (
            <div className={styles.wrapper}>
                <Settings
                    init={this.init}
                    defaultRow={3}
                    defaultColumn={3}
                    defaultMode={0}
                />
                <div className={styles.playgroundWrapper}>
                    <Info
                        winner={winner}
                        chess={chess}
                        goback={this.goback}
                        gameState={gameState}
                        updateGameState={this.props.updateGameState}
                    />
                    <Panel
                        column={column}
                        row={row}
                        onClick={(row, column) =>
                            this.handleClick(row, column, false)
                        }
                        gameState={gameState[step]}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapState, mapDispatch)(Board);
