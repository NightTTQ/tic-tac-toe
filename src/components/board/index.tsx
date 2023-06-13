import { Component, MouseEvent } from 'react';
import { connect } from 'react-redux';

import { type GameState, mapState, mapDispatch } from './stateStore';
import Settings from './settings';
import Info from './info';
import Panel from './panel';
import styles from './index.module.css';
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
            winner: undefined,
            step: 0,
            chess: '',
        };
    }

    /**
     * @desc 初始化游戏
     * @param column 列数
     * @param row 行数
     * @param modeIndex 游戏模式
     */
    init = (column: number, row: number, modeIndex: number) => {
        this.setState({
            mode: modeIndex,
            column,
            row,
            winner: undefined,
        });
        const data: string[][] = new Array(row)
            .fill(0)
            .map(() => new Array(column).fill(''));
        const { nextChess } = handlers[modeIndex].init();
        this.props.updateGameState([{ data, nextChess }]);
        this.setState((prevState) => {
            return {
                column: prevState.column,
                row: prevState.row,
                mode: prevState.mode,
                winner: prevState.winner,
                step: 0,
                chess: nextChess,
            };
        });
    };
    /**
     * @desc 处理点击事件
     * @param newRow 新棋子所在行
     * @param newCol 新棋子所在列
     */
    handleClick = (newRow: number, newCol: number) => {
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
        this.setState((prevState) => {
            return {
                column: prevState.column,
                row: prevState.row,
                mode: prevState.mode,
                winner: newWinner,
                step: prevState.step + 1,
                chess: nextChess,
            };
        });
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
                        onClick={this.handleClick}
                        gameState={gameState[step]}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapState, mapDispatch)(Board);
