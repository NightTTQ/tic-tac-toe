import { Outlet, NavLink } from 'react-router-dom';

import styles from './App.module.css';

/**
 * @desc App
 */
function App () {
    return (
        <div className={styles.app}>
            <nav className={styles.nav}>
                <NavLink
                    to={'/'}
                    className={({ isActive }) => (isActive ? styles.active : '')}
                >
                    Home
                </NavLink>
                <NavLink
                    to={'/tictactoe'}
                    className={({ isActive }) => (isActive ? styles.active : '')}
                >
                    TicTacToe
                </NavLink>
            </nav>
            <Outlet />
        </div>
    );
}

export default App;
