import { MouseEvent, memo } from "react";

import Square from "../sqare";
import styles from "./index.module.css";

type Props = {
  data: string[][];
  column: number;
  row: number;
  handleClick: (event: MouseEvent<HTMLDivElement>, index: number) => void;
};

const Panel = (props: Props) => {
  return (
    <div
      className={styles.panel}
      style={{
        gridTemplateColumns: `repeat(${props.column}, 1fr)`,
        gridTemplateRows: `repeat(${props.row}, 1fr)`,
      }}
    >
      {props.data.map((line, rowIndex) => {
        return line.map((item, columnIndex) => (
          <Square
            content={item}
            index={rowIndex * line.length + columnIndex}
            key={`${rowIndex * line.length + columnIndex}`}
            handleClick={props.handleClick}
          />
        ));
      })}
    </div>
  );
};

export default memo(Panel, (prevProps, nextProps) => {
  return (
    prevProps.data.toString() === nextProps.data.toString() &&
    prevProps.column === nextProps.column &&
    prevProps.row === nextProps.row &&
    prevProps.handleClick === nextProps.handleClick
  );
});
