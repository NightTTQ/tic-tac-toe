import { memo, MouseEvent } from 'react';

import styles from './index.module.css';

type Props = {
    onClick: (
        event: MouseEvent<HTMLDivElement>,
        row: number,
        column: number
    ) => void;
    row: number;
    column: number;
    content?: string;
};

/**
 * @desc 棋盘格子
 */
const Square = (props: Props) => {
    return (
        <div
            className={styles.sqare}
            onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                event.target = event.currentTarget;
                props.onClick(event, props.row, props.column);
            }}
        >
            <div className={styles.text}>{props.content}</div>
        </div>
    );
};

export default memo(Square);
