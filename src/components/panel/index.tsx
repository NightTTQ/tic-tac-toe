import { useCallback, memo, MouseEvent } from 'react';

import Square from '../sqare';
import styles from './index.module.css';

type Props = {
    data: string[][];
    column: number;
    row: number;
    handleClick?: (newRow: number, newCol: number) => void;
};

/**
 * @desc 棋盘
 */
const Panel = (props: Props) => {
    console.log('Panel render');
    /**
     * @desc 点击事件分发器
     * @param row 点击的行
     * @param column 点击的列
     */
    const clickDispacher = useCallback(
        (event: MouseEvent<HTMLDivElement>, rowIndex: number, columnIndex: number) => {
            console.log(event);
            props.handleClick && props.handleClick(rowIndex, columnIndex);
        },
        [props.handleClick]
    );
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
                        key={`${rowIndex * line.length + columnIndex}`}
                        row={rowIndex}
                        column={columnIndex}
                        onClick={clickDispacher}
                    />
                ));
            })}
        </div>
    );
};

// export default memo(Panel, (prevProps, nextProps) => {
//     return (
//         prevProps.data.toString() === nextProps.data.toString() &&
//         prevProps.column === nextProps.column &&
//         prevProps.row === nextProps.row &&
//         prevProps.handleClick === nextProps.handleClick
//     );
// });
export default memo(Panel);
