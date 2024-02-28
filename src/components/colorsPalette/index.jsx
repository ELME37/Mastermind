import React from 'react';
import './styles.scss';

export default function ColorsPalette({ colors, onClick }) {
  return (
    <div className="color-options">
      {colors.map((color) => (
        <div
          key={color}
          className={`color-option ${color}`}
          style={{ backgroundColor: color }}
          onClick={() => onClick(color)}
        />
      ))}
    </div>
  );
}; 