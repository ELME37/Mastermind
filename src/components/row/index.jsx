import React from 'react';
import './styles.scss';
import Slot from '../slot';
import Dot from '../dot';

export default function Row ({ row, rowIndex, activeRowIndex, selectedPawnIndex, onSlotClick }) {
    return (
        <div className={`row ${rowIndex === activeRowIndex ? 'active' : 'inactive'}`}>
            <div className='rowNumber'>{rowIndex + 1}</div>
            <div className='slotSelector'>
                {row.colors.map((color, colorIndex) => (
                    <Slot
                        key={colorIndex}
                        color={color}
                        onClick={() => onSlotClick(colorIndex)}
                        isActive={rowIndex === activeRowIndex && colorIndex === selectedPawnIndex}
                    />
                ))}
            </div>
            <div className="feedback">
                {/* Utilise le composant Dot pour chaque point */}
                {Array(row.remainingDotsLength).fill(null).map((_, index) => (
                    <Dot key={index} color='dot' />
                ))}
                {Array(row.exactMatches).fill(null).map((_, index) => (
                    <Dot key={index} color='black-dot' />
                ))}
                {Array(row.misplacedMatches).fill(null).map((_, index) => (
                    <Dot key={index} color='white-dot' />
                ))}
            </div>
        </div>
    );
};