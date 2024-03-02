import React from 'react';
import './styles.scss';
import Slot from '../slot';
import Dot from '../dot';

export default function Row ({ row, rowIndex, activeRowIndex, selectedPawnIndex, onSlotClick, onCheckRow }) {
    const isRowComplete = row.colors.every(color => color !== '');

    const handleCheckRow = () => {
        onCheckRow(rowIndex);
    };

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
                {Array(row.exactMatches).fill(null).map((_, index) => (
                    <Dot key={index} color='black-dot' />
                ))}
                {Array(row.misplacedMatches).fill(null).map((_, index) => (
                    <Dot key={index} color='white-dot' />
                ))}
                {Array(row.remainingDotsLength).fill(null).map((_, index) => (
                    <Dot key={index} color='dot' />
                ))}
                <div className={`btnRowCheck ${rowIndex === activeRowIndex ? 'active' : 'inactive'} ${isRowComplete ? 'complete' : ''}`}>
                    {rowIndex === activeRowIndex && isRowComplete && <button className='btn__ok' onClick={handleCheckRow}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                    </svg>
                    </button>}
                </div>
            </div>
        </div>
    );
};