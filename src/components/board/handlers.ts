const handlers: {
  name: string;
  handler: (
    data: string[][],
    newRow: number,
    newCol: number,
    column: number,
    row: number,
    chess: string,
    setData: React.Dispatch<React.SetStateAction<string[][]>>,
    setWinner: React.Dispatch<React.SetStateAction<string | undefined>>,
    setChess: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  init: (setChess: React.Dispatch<React.SetStateAction<string>>) => void;
}[] = [
  {
    // 三连子游戏
    name: "tictactoe",
    handler: (
      data: string[][],
      newRow: number,
      newCol: number,
      column: number,
      row: number,
      chess: string,
      setData: React.Dispatch<React.SetStateAction<string[][]>>,
      setWinner: React.Dispatch<React.SetStateAction<string | undefined>>,
      setChess: React.Dispatch<React.SetStateAction<string>>
    ) => {
      // 下棋
      const newChess = data[newRow][newCol];
      let isWin = false;
      // 判断行
      if (!isWin) {
        // 向右统计
        let x = newCol + 1;
        let y = newRow;
        let count = 1;
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
      // 判断左上右下斜线
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
      }
      // 判断右上左下斜线
      // 向左下统计
      if (!isWin) {
        let x = newCol - 1;
        let y = newRow + 1;
        let count = 1;
        while (x >= 0 && y < row && data[y][x] === newChess) {
          x--;
          y++;
          count++;
          if (count >= 3) {
            isWin = true;
            break;
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
    },
    init: (setChess: React.Dispatch<React.SetStateAction<string>>) => {
      setChess("X");
    },
  },
  {
    // 五子棋游戏
    name: "gomoku",
    handler: (
      data: string[][],
      newRow: number,
      newCol: number,
      column: number,
      row: number,
      chess: string,
      setData: React.Dispatch<React.SetStateAction<string[][]>>,
      setWinner: React.Dispatch<React.SetStateAction<string | undefined>>,
      setChess: React.Dispatch<React.SetStateAction<string>>
    ) => {
      // 下棋
      const newChess = data[newRow][newCol];
      let isWin = false;
      // 判断行
      if (!isWin) {
        // 向右统计
        let x = newCol + 1;
        let y = newRow;
        let count = 1;
        while (x < column && data[y][x] === newChess) {
          x++;
          count++;
          if (count >= 5) {
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
            if (count >= 5) {
              isWin = true;
              break;
            }
          }
        }
      }
      // 判断列
      if (!isWin) {
        // 向下统计
        let x = newCol;
        let y = newRow + 1;
        let count = 1;
        while (y < row && data[y][x] === newChess) {
          y++;
          count++;
          if (count >= 5) {
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
            if (count >= 5) {
              isWin = true;
              break;
            }
          }
        }
      }
      // 判断左上右下斜线
      if (!isWin) {
        // 向右下统计
        let x = newCol + 1;
        let y = newRow + 1;
        let count = 1;
        while (x < column && y < row && data[y][x] === newChess) {
          x++;
          y++;
          count++;
          if (count >= 5) {
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
            if (count >= 5) {
              isWin = true;
              break;
            }
          }
        }
      }
      // 判断右上左下斜线
      if (!isWin) {
        // 向左下统计
        let x = newCol - 1;
        let y = newRow + 1;
        let count = 1;
        while (x >= 0 && y < row && data[y][x] === newChess) {
          x--;
          y++;
          count++;
          if (count >= 5) {
            isWin = true;
            break;
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
            if (count >= 5) {
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
        if (chess === "⚫") {
          setChess("⚪");
        } else if (chess === "⚪") {
          setChess("⚫");
        }
      }
    },
    init: (setChess: React.Dispatch<React.SetStateAction<string>>) => {
      setChess("⚫");
    },
  },
];

export default handlers;
