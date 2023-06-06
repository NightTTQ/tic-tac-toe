import { memo, MouseEvent } from "react";

import styles from "./index.module.css";

type Props = {
  handleClick: (event: MouseEvent<HTMLDivElement>, index: number) => void;
  index: number;
  content?: string;
};

const Square = (props: Props) => {
  return (
    <div
      className={styles.sqare}
      onClick={(e) => props.handleClick(e, props.index)}
    >
      <div className={styles.text}>{props.content}</div>
    </div>
  );
};

export default memo(Square, (prevProps, nextProps) => {
  return (
    prevProps.content === nextProps.content &&
    prevProps.index === nextProps.index &&
    prevProps.handleClick === nextProps.handleClick
  );
});
