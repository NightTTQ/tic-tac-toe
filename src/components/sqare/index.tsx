import { useState, memo, MouseEvent } from "react";

import styles from "./index.module.css";

type Props = {
  handleClick: (event: MouseEvent<HTMLDivElement>, index: number) => void;
  index: number;
  content?: string;
};

const Square = (props: Props) => {
  // console.log("square");

  return (
    <div
      className={styles.sqare}
      onClick={(e) => props.handleClick(e, props.index)}
    >
      <div className={styles.text}>{props.content}</div>
    </div>
  );
};

export default memo(Square);
