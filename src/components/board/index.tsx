import { useState, memo, useRef, MouseEvent, useEffect } from "react";

import Square from "../sqare";
import styles from "./index.module.css";

const Board = () => {
  // console.log("board");
  const [column, setColumn] = useState(3);
  const [row, setRow] = useState(3);
  const [data, setData] = useState<string[][]>([]);
  const [mode, setMode] = useState(0);
  const [winner, setWinner] = useState<string>();
  const [history, setHistory] = useState<{ data: string[][]; chess: string }[]>(
    []
  );
  const [chess, setChess] = useState<string>("");
  const [step, setStep] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const rowRef = useRef<HTMLInputElement>(null);
  const columnRef = useRef<HTMLInputElement>(null);
  const modeRef = useRef<HTMLSelectElement>(null);

  const handlers = [
    {
      // 三连子
      name: "tictactoe",
      handler: (data: string[][], newRow?: number, newCol?: number) => {
        if (newRow !== undefined && newCol !== undefined) {
          // 下棋
          const newChess = data[newRow][newCol];
          let isWin = false;
          // 判断行
          if (!isWin) {
            let x = newCol + 1;
            let y = newRow;

            let count = 1;
            // 向右统计
            while (x < column && data[y][x] === newChess) {
              x++;
              count++;
              if (count >= 3) {
                isWin = true;
                break;
              }
            }
            // 向左统计
            if (!isWin) {
              x = newCol - 1;
              while (x >= 0 && data[y][x] === newChess) {
                x--;
                count++;
                if (count >= 3) {
                  isWin = true;
                  break;
                }
              }
            }
          }
          // 判断列
          if (!isWin) {
            let x = newCol;
            let y = newRow + 1;

            let count = 1;
            // 向下统计
            while (y < row && data[y][x] === newChess) {
              y++;
              count++;
              if (count >= 3) {
                isWin = true;
                break;
              }
            }
            // 向上统计
            if (!isWin) {
              y = newRow - 1;
              while (y >= 0 && data[y][x] === newChess) {
                y--;
                count++;
                if (count >= 3) {
                  isWin = true;
                  break;
                }
              }
            }
          }
          // 判断斜线
          if (!isWin) {
            let x = newCol + 1;
            let y = newRow + 1;

            let count = 1;
            // 向右下统计
            while (x < column && y < row && data[y][x] === newChess) {
              x++;
              y++;
              count++;
              if (count >= 3) {
                isWin = true;
                break;
              }
            }
            // 向左上统计
            if (!isWin) {
              x = newCol - 1;
              y = newRow - 1;
              while (x >= 0 && y >= 0 && data[y][x] === newChess) {
                x--;
                y--;
                count++;
                if (count >= 3) {
                  isWin = true;
                  break;
                }
              }
            }
            // 向左下统计
            if (!isWin) {
              x = newCol - 1;
              y = newRow + 1;
              while (x >= 0 && y < row && data[y][x] === newChess) {
                x--;
                y++;
                count++;
                if (count >= 3) {
                  isWin = true;
                  break;
                }
              }
            }
            // 向右上统计
            if (!isWin) {
              x = newCol + 1;
              y = newRow - 1;
              while (x < column && y >= 0 && data[y][x] === newChess) {
                x++;
                y--;
                count++;
                if (count >= 3) {
                  isWin = true;
                  break;
                }
              }
            }
          }
          // 判断平局
          if (!isWin) {
            let isFull = true;
            for (let i = 0; i < row; i++) {
              for (let j = 0; j < column; j++) {
                if (data[i][j] === "") {
                  isFull = false;
                  break;
                }
                if (!isFull) break;
              }
            }
            if (isFull) {
              setWinner("平局");
            }
          }
          // 更新棋盘
          setData(data);
          // 判断胜者
          if (isWin) {
            setWinner(newChess);
          } else {
            // 更新下一颗棋子
            if (chess === "X") {
              setChess("O");
            } else if (chess === "O") {
              setChess("X");
            }
          }
        }
      },
      init: () => {
        setChess("X");

        // setHistory((prev) => [...prev, data]);
      },
    },
    {
      // 五子棋
      name: "gomoku",
      handler: (data: string[][], newRow?: number, newCol?: number) => {},
      init: () => {},
    },
  ];

  useEffect(() => {
    if (isRolling) {
      // 悔棋不更新历史记录
      setIsRolling(false);
    } else if (data.length > 0) {
      // 下棋更新历史记录
      setHistory((prev) => [...prev.slice(0, step), { data, chess }]);
      setStep((prev) => prev + 1);
    }
  }, [data]);
  /**
   * @desc 初始化游戏
   */
  const init = () => {
    const column = Number(columnRef.current?.value);
    const row = Number(rowRef.current?.value);
    setMode(Number(modeRef.current?.value));
    setColumn(column);
    setRow(row);
    setWinner(undefined);
    setHistory([]);
    setChess("");
    setData(Array(row).fill(Array(column).fill("")));
    setStep(0);
    handlers[mode].init();
  };
  /**
   * @desc 处理点击事件
   */
  const handleClick = (event: MouseEvent<HTMLDivElement>, index: number) => {
    if (winner) return;
    const newRow = Math.floor(index / column);
    const newCol = index % column;
    if (data[newRow][newCol]) return;
    const newData = data.map((line, rowIndex) =>
      line.map((item, columnIndex) => {
        if (rowIndex === newRow) {
          if (columnIndex === newCol) {
            return chess;
          }
        }
        return item;
      })
    );
    handlers[mode].handler(newData, newRow, newCol);
  };
  /**
   * @desc 悔棋
   */
  const goback = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    setIsRolling(true);
    if (winner) setWinner(undefined);
    setStep(index + 1);
    setData(history[index].data);
    setChess(history[index].chess);
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
          <select name="mode" id="mode" defaultValue={mode} ref={modeRef}>
            {handlers.map((item, index) => (
              <option key={index} value={index}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={init}>开始</button>
      </div>
      <div>
        {chess && !winner && <p>执棋者：{chess}</p>}
        {winner && <p>胜利者：{winner}</p>}
        {history.length > 0 &&
          history.map((item, index) => (
            <button onClick={(e) => goback(e, index)} key={index}>
              {index === 0 ? "悔棋至开局" : `悔棋至第${index}步`}
            </button>
          ))}
      </div>
      <div
        className={styles.board}
        style={{
          gridTemplateColumns: `repeat(${column}, 1fr)`,
          gridTemplateRows: `repeat(${row}, 1fr)`,
        }}
      >
        {data.map((line, rowIndex) => {
          return line.map((item, columnIndex) => (
            <Square
              content={item}
              index={rowIndex * line.length + columnIndex}
              key={`${rowIndex * line.length + columnIndex}`}
              handleClick={handleClick}
            />
          ));
        })}
      </div>
    </div>
  );
};

export default memo(Board);
