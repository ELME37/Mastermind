import React from 'react';
import './styles.scss';

export default function Modal ({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>Close</button>
        {children}
      </div>
    </div>
  );
};