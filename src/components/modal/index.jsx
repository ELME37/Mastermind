import React from 'react';
import './styles.scss';

export default function Modal ({ isOpen, onClose, restartAnimation, children }) {
  if (!isOpen) return null;

  const handleonCloseAndRestartAnimation = () => {
    onClose(); // Appelle la fonction oneClose
    restartAnimation(); // Appelle la fonction restartAnimation
  };

  return (
    <div className="modal">
        {children}
        <button className="modal__btn--close" onClick={handleonCloseAndRestartAnimation}>Retour au jeu</button>
    </div>
  );
};