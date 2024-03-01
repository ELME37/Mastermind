import React from 'react';
import './styles.scss';

export default function GameControls ({ onStartGame, onEndGame, gameOver }) {
    return (
        <div className="game-controls">
            {!gameOver && <button onClick={onStartGame}>Démarrer le jeu</button>}
            {gameOver && <button onClick={onEndGame}>Clôturer le jeu</button>}
        </div>
    );
};