import { memo, MouseEvent } from 'react';

import styles from './index.module.css';

type Props = {
    handleClick: (event: MouseEvent<HTMLDivElement>, index: number) => void;
    index: number;
    content?: string;
};

/**
 * @desc 棋盘格子
 */
const Square = (props: Props) => {
    return (
        <div
            className={styles.sqare}
            onClick={(event) => props.handleClick(event, props.index)}
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
