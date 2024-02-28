// Pawn.js
import React, { useState } from 'react';
import Pawn from '../pawn';
import ColorsPalette from '../colorsPalette';
import './styles.scss';

export default function PawnSelector() {
  const [colors, setColors] = useState(['', '', '', '']);
  const [selectedPawnIndex, setSelectedPawnIndex] = useState(0);

  const changeColor = (color) => {
    const newColors = [...colors];
    newColors[selectedPawnIndex] = color;
    setColors(newColors);
    setSelectedPawnIndex((selectedPawnIndex + 1) % 4);
  };

  return (
    <div className="pawnSelector">
      {colors.map((color, index) => (
        <Pawn
          key={index}
          color={color}
          onClick={() => setSelectedPawnIndex(index)}
        />
      ))}
      <ColorsPalette colors={['red', 'green', 'blue', 'yellow']} onClick={changeColor} />
    </div>
  );
}