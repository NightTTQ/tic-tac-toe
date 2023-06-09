import { memo, MouseEvent } from 'react';

import styles from './index.module.css';

type Props = {
    onClick: (event: MouseEvent<HTMLDivElement>, row: number, column: number) => void;
    row: number;
    column: number;
    content?: string;
};

/**
 * @desc 棋盘格子
 */
const Square = (props: Props) => {
    console.log('Square render');
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

/**
 * 从逻辑上讲，点击下棋时，只有被点击的格子的内容会发生变化，其他格子的内容不会发生变化，所以只需要比较被点击的格子的内容是否发生变化即可
 * 但是handleClick函数是在父组件Panel中定义的，handleClick函数又有状态依赖，只要点击下棋成功，依赖就会发生变化，所以每次点击时，handleClick函数都会重新生成，这样Square组件又会重新渲染了
 */
export default memo(Square);
