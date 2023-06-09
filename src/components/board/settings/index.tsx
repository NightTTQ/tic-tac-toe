import { Component, createRef, memo } from 'react';

import styles from './index.module.css';
import handlers from '../handlers';

export type Props = {
    defaultColumn: number;
    defaultRow: number;
    defaultMode: number;
    init: (
        column: number,
        row: number,
        modeIndex: number,
        withAI: boolean,
        isAiFrist?: boolean
    ) => void;
};
export type State = {};

class Settings extends Component<Props, State> {
    constructor (props: Props) {
        super(props);
    }

    rowRef = createRef<HTMLInputElement>();
    columnRef = createRef<HTMLInputElement>();
    modeRef = createRef<HTMLSelectElement>();

    init = (withAI: boolean, isAiFrist?: boolean) => {
        const row = Number(this.rowRef.current?.value);
        const column = Number(this.columnRef.current?.value);
        const modeIndex = Number(this.modeRef.current?.value);
        if (
            isNaN(column) ||
            isNaN(row) ||
            column <= 0 ||
            row <= 0 ||
            !handlers[modeIndex]
        ) {
            alert('游戏配置错误');
            return;
        }
        if (withAI) this.props.init(3, 3, 0, withAI, isAiFrist);
        else this.props.init(column, row, modeIndex, withAI);
    };

    render () {
        return (
            <div className={styles.settingWrapper}>
                <div>
                    <label htmlFor="row">行数</label>
                    <input
                        type="number"
                        id="row"
                        defaultValue={this.props.defaultRow}
                        min={1}
                        ref={this.rowRef}
                    />
                </div>
                <div>
                    <label htmlFor="column">列数</label>
                    <input
                        type="number"
                        id="column"
                        defaultValue={this.props.defaultColumn}
                        min={1}
                        ref={this.columnRef}
                    />
                </div>
                <div>
                    <label htmlFor="mode">游戏模式</label>
                    <select
                        name="mode"
                        id="mode"
                        defaultValue={this.props.defaultMode}
                        ref={this.modeRef}
                    >
                        {handlers.map((item, index) => (
                            <option
                                key={index}
                                value={index}
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={() => this.init(false)}>开始</button>
                <button onClick={() => this.init(true, true)}>
                    AI先手模式
                </button>
                <button onClick={() => this.init(true, false)}>
                    AI后手模式
                </button>
            </div>
        );
    }
}

export default memo(Settings);
