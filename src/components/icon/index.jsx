import React from 'react';
import './styles.scss';

export default function Icon({ children, onClick }) {

  return (
    <div className='icon' onClick={onClick}>
      {children}
    </div>
  );
}
