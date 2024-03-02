import React from 'react';
import './styles.scss';

export default function Modal ({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
        {children}
        <button className="modal__btn--close" onClick={onClose}>Retour au jeu</button>
    </div>
  );
};