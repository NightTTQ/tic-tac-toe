import styles from './App.module.css';
import Board from './components/board';

/**
 * @desc App
 */
function App () {
    return (
        <div className={styles.app}>
            <Board />
        </div>
    );
}

export default App;
