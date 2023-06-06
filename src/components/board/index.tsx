import { useState, useRef, MouseEvent, useEffect } from "react";

import Panel from "../panel";
import styles from "./index.module.css";
import handlers from "./handlers";

const Board = () => {
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
    const mode = Number(modeRef.current?.value);
    if (
      isNaN(column) ||
      isNaN(row) ||
      column <= 0 ||
      row <= 0 ||
      isNaN(mode) ||
      !handlers[mode]
    ) {
      alert("游戏配置错误");
      return;
    }
    setMode(mode);
    setColumn(column);
    setRow(row);
    setWinner(undefined);
    setData(Array(row).fill(Array(column).fill("")));
    setStep(0);
    handlers[mode].init(setChess);
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
    handlers[mode].handler(
      newData,
      newRow,
      newCol,
      column,
      row,
      chess,
      setData,
      setWinner,
      setChess
    );
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
      <div className={styles.playgroundWrapper}>
        <div className={styles.infoWrapper}>
          <div className={styles.textArea}>
            {chess && !winner && <p>执棋者：{chess}</p>}
            {winner && <p>胜利者：{winner}</p>}
          </div>
          <div className={styles.backoffList}>
            {history.length > 0 &&
              history.map((item, index) => (
                <button onClick={(e) => goback(e, index)} key={index}>
                  {index === 0 ? "悔棋至开局" : `悔棋至第${index}步`}
                </button>
              ))}
          </div>
        </div>
        <Panel
          data={data}
          row={row}
          column={column}
          handleClick={handleClick}
        />
      </div>
    </div>
  );
};

export default Board;
