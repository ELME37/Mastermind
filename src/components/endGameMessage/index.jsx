import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';
import ROUTES from '../../router/routes';

export default function EndGameMessage ({ isOpen, children, newGame, closeEndGameMessage }) {
  if (!isOpen) return null;

  const newGameAndcloseEndGameMessage = () => {
    newGame(); // Appelle la fonction newGame
    closeEndGameMessage(); // Appelle la fonction closeEndGameMessage
  };

  return (
    <div className="endGameMessage">
        {children}
        <div className='endGameMessage__btns'>
          <button className="endGameMessage__btn" onClick={newGameAndcloseEndGameMessage}>Nouvelle partie</button>
          <Link to={ROUTES.home}><button className="endGameMessage__btn" onClick={closeEndGameMessage}>Retour à la page d'accueil</button></Link>
        </div>
    </div>
  );
};
