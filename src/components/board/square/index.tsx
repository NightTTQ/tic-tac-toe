import { PureComponent, MouseEvent } from 'react';

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
class Square extends PureComponent<Props> {
    constructor (props: Props) {
        super(props);
    }

    handleClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();
        event.target = event.currentTarget;
        this.props.onClick(event, this.props.row, this.props.column);
    };

    render () {
        const { content } = this.props;

        return (
            <div
                className={styles.sqare}
                onClick={this.handleClick}
            >
                <div className={styles.text}>{content}</div>
            </div>
        );
    }
}

export default Square;
