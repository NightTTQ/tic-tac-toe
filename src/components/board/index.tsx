import { useState, useRef, useEffect, MouseEvent, useCallback } from 'react';

import Square from './square';
import styles from './index.module.css';
import handlers from './handlers';

/**
 * @desc 游戏模块
 */
const Board = () => {
    const [column, setColumn] = useState(3);
    const [row, setRow] = useState(3);
    const [mode, setMode] = useState(0);
    const [winner, setWinner] = useState<string>();
    // 记录游戏状态，后续改为redux
    const stateRef = useRef<
    {
        data: string[][];
        nextChess: string;
        curRow?: number;
        curCol?: number;
        winner?: string;
    }[]
    >([]);
    // 去不掉的原因是，在history中添加一个flag来表明这一项是需要展示的状态，要将这个状态传给panel就必须遍历history，步数多一点就会有性能问题
    const stepRef = useRef(0);
    const [chess, setChess] = useState<string>('');
    const handleClickRef = useRef<(newRow: number, newCol: number) => void>();
    const rowRef = useRef<HTMLInputElement>(null);
    const columnRef = useRef<HTMLInputElement>(null);
    const modeRef = useRef<HTMLSelectElement>(null);

    /**
     * @desc 初始化游戏
     */
    const init = () => {
        const column = Number(columnRef.current?.value);
        const row = Number(rowRef.current?.value);
        const modeIndex = Number(modeRef.current?.value);
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
        setMode(modeIndex);
        setColumn(column);
        setRow(row);
        setWinner(undefined);
        const data = new Array(row)
            .fill(0)
            .map(() => new Array(column).fill(''));
        const { nextChess } = handlers[modeIndex].init();
        stateRef.current = [{ data, nextChess }];
        stepRef.current = 0;
        setChess(nextChess);
    };
    /**
     * @desc 处理点击事件
     * @param newRow 新棋子所在行
     * @param newCol 新棋子所在列
     */
    const handleClick = (newRow: number, newCol: number) => {
        const { data } = stateRef.current[stepRef.current];
        if (winner) return;
        // 点击已经有棋的格子不处理
        if (data[newRow][newCol]) return;
        // 先给棋盘赋值，再判断是否胜利
        const newData = data.map((line, rowIndex) =>
            line.map((item, columnIndex) => {
                if (rowIndex === newRow) {
                    if (columnIndex === newCol) {
                        return chess;
                    }
                }
                return item;
            }));
        // 由玩法处理棋盘数据并判断胜利和下颗棋子
        const { nextChess, newWinner } = handlers[mode].handler(
            newData,
            newRow,
            newCol,
            column,
            row,
            chess,
            stepRef.current
        );
        // 可能是一步新棋，也可能是悔棋后的新棋
        if (stepRef.current === stateRef.current.length - 1) {
            // 新棋
            stateRef.current.push({
                data: newData,
                nextChess,
                curRow: newRow,
                curCol: newCol,
                winner: newWinner,
            });
        } else {
            // 悔棋后的新棋
            stateRef.current = [
                ...stateRef.current.slice(0, stepRef.current + 1),
                {
                    data: newData,
                    nextChess,
                    curRow: newRow,
                    curCol: newCol,
                    winner: newWinner,
                },
            ];
        }
        stepRef.current++;
        setChess(nextChess);
        setWinner(newWinner);
    };

    useEffect(() => {
        handleClickRef.current = handleClick;
    }, [handleClick]);

    const onClick = useCallback(
        (event: MouseEvent<HTMLDivElement>, row: number, col: number) => {
            handleClickRef.current?.(row, col);
        },
        []
    );

    /**
     * @desc 悔棋
     */
    const goback = (event: MouseEvent<HTMLButtonElement>, index: number) => {
        stepRef.current = index;
        setChess(stateRef.current[index].nextChess);
        setWinner(stateRef.current[index].winner);
    };
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
                        ref={rowRef}
                    />
                </div>
                <div>
                    <label htmlFor="column">列数</label>
                    <input
                        type="number"
                        id="column"
                        defaultValue={column}
                        min={1}
                        ref={columnRef}
                    />
                </div>
                <div>
                    <label htmlFor="mode">游戏模式</label>
                    <select
                        name="mode"
                        id="mode"
                        defaultValue={mode}
                        ref={modeRef}
                    >
                        {handlers.map((item, index) => (
                            <option key={index} value={index}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={init}>开始</button>
            </div>
            <div className={styles.playgroundWrapper}>
                <div className={styles.infoWrapper}>
                    <div className={styles.textArea}>
                        {chess && !winner && <p>执棋者：{chess}</p>}
                        {winner && <p>胜利者：{winner}</p>}
                    </div>
                    <div className={styles.backoffList}>
                        {stateRef.current?.length > 0 &&
                            stateRef.current.map((item, index) => (
                                <button
                                    onClick={(event) => goback(event, index)}
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
                    {stateRef.current[stepRef.current] &&
                        stateRef.current[stepRef.current].data.map((line, rowIndex) =>
                            line.map((item, columnIndex) => (
                                <Square
                                    key={columnIndex}
                                    row={rowIndex}
                                    column={columnIndex}
                                    content={item}
                                    onClick={onClick}
                                />
                            )))}
                </div>
            </div>
        </div>
    );
};

export default Board;
