import React from 'react';
import './styles.scss';

export default function ColorsPalette({ colors, onClick, className }) {
  return (
    <div className="color-options">
      {colors.map((color) => (
        <div
          key={color}
          className={`color-option ${className}`}
          style={{ backgroundColor: color }}
          onClick={() => onClick(color)}
        />
      ))}
    </div>
  );
}; 