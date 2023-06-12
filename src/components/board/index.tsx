import React, { createRef, MouseEvent } from 'react';
import { connect } from 'react-redux';

import { type GameState, mapState, mapDispatch } from './stateStore';
import Square from './square';
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
class Board extends React.Component<Props, State> {
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
    rowRef = createRef<HTMLInputElement>();
    columnRef = createRef<HTMLInputElement>();
    modeRef = createRef<HTMLSelectElement>();

    /**
     * @desc 初始化游戏
     */
    init = () => {
        const column = Number(this.columnRef.current?.value);
        const row = Number(this.rowRef.current?.value);
        const modeIndex = Number(this.modeRef.current?.value);
        if (
            isNaN(column) ||
            isNaN(row) ||
            column <= 0 ||
            row <= 0 ||
            !handlers[modeIndex]
        ) {
            alert('游戏配置错误');
            return;
        }
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
        const { column, row, mode, winner, chess, step } = this.state;

        return (
            <div className={styles.wrapper}>
                <div className={styles.settingWrapper}>
                    <div>
                        <label htmlFor="row">行数</label>
                        <input
                            type="number"
                            id="row"
                            defaultValue={row}
                            min={1}
                            ref={this.rowRef}
                        />
                    </div>
                    <div>
                        <label htmlFor="column">列数</label>
                        <input
                            type="number"
                            id="column"
                            defaultValue={column}
                            min={1}
                            ref={this.columnRef}
                        />
                    </div>
                    <div>
                        <label htmlFor="mode">游戏模式</label>
                        <select
                            name="mode"
                            id="mode"
                            defaultValue={mode}
                            ref={this.modeRef}
                        >
                            {handlers.map((item, index) => (
                                <option
                                    key={index}
                                    value={index}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={this.init}>开始</button>
                </div>
                <div className={styles.playgroundWrapper}>
                    <div className={styles.infoWrapper}>
                        <div className={styles.textArea}>
                            {chess && !winner && <p>执棋者：{chess}</p>}
                            {winner && <p>胜利者：{winner}</p>}
                        </div>
                        <div className={styles.backoffList}>
                            {gameState.length > 0 &&
                                gameState.map((item, index) => (
                                    <button
                                        onClick={(event) =>
                                            this.goback(event, index)
                                        }
                                        key={index}
                                    >
                                        {index === 0
                                            ? '悔棋至开局'
                                            : `悔棋至第${index}步`}
                                    </button>
                                ))}
                        </div>
                    </div>
                    <div
                        className={styles.panel}
                        style={{
                            gridTemplateColumns: `repeat(${column}, 1fr)`,
                            gridTemplateRows: `repeat(${row}, 1fr)`,
                        }}
                    >
                        {gameState[step] &&
                            gameState[step].data.map((line, rowIndex) =>
                                line.map((item, columnIndex) => (
                                    <Square
                                        key={columnIndex}
                                        row={rowIndex}
                                        column={columnIndex}
                                        content={item}
                                        onClick={(event, row, column) =>
                                            this.handleClick(row, column)
                                        }
                                    />
                                )))}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapState, mapDispatch)(Board);
