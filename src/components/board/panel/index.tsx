import { Component, memo } from 'react';

import Square from './square';
import { type GameState } from '../stateStore';
import styles from './index.module.css';

export type Props = {
    row: number;
    column: number;
    gameState?: GameState;
    onClick: (row: number, column: number) => void;
};
export type State = {};

class Panel extends Component<Props, State> {
    constructor (props: Props) {
        super(props);
    }
    render () {
        const { row, column, gameState, onClick } = this.props;
        return (
            <div
                className={styles.panel}
                style={{
                    gridTemplateColumns: `repeat(${column}, 1fr)`,
                    gridTemplateRows: `repeat(${row}, 1fr)`,
                }}
            >
                {gameState?.data &&
                    gameState.data.map((line, rowIndex) =>
                        line.map((item, columnIndex) => (
                            <Square
                                key={columnIndex}
                                row={rowIndex}
                                column={columnIndex}
                                content={item}
                                onClick={(event, row, column) =>
                                    onClick(row, column)
                                }
                            />
                        )))}
            </div>
        );
    }
}

export default memo(Panel);
