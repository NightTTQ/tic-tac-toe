import { Component, MouseEvent, memo } from 'react';

import styles from './index.module.css';
import { type GameState } from '../stateStore';

export type Props = {
    winner?: string;
    chess: string;
    gameState: GameState[];
    updateGameState: (state: GameState[]) => void;
    goback: (event: MouseEvent<HTMLButtonElement>, step: number) => void;
};
export type State = {};

class Info extends Component<Props, State> {
    constructor (props: Props) {
        super(props);
        this.state = {
            winner: undefined,
            step: 0,
            chess: '',
        };
    }

    render () {
        const { winner, chess, gameState } = this.props;

        return (
            <div className={styles.infoWrapper}>
                <div className={styles.textArea}>
                    {chess && !winner && <p>执棋者：{chess}</p>}
                    {winner && <p>胜利者：{winner}</p>}
                </div>
                <div className={styles.backoffList}>
                    {gameState.length > 0 &&
                        gameState.map((item, index) => (
                            <button
                                onClick={(event) =>
                                    this.props.goback(event, index)
                                }
                                key={index}
                            >
                                {index === 0
                                    ? '悔棋至开局'
                                    : `悔棋至第${index}步`}
                            </button>
                        ))}
                </div>
            </div>
        );
    }
}

export default memo(Info);
