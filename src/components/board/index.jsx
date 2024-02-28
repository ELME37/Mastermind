import React, { useState, useEffect, useCallback } from 'react';
import './styles.scss';
import Slot from '../slot';
import ColorsPalette from '../colorsPalette';
import { Colors } from '../colors';
import SecretCode, { newCode } from '../secretCode';

export default function Board() {
    const [rows, setRows] = useState(Array.from({ length: 8 }, () => ({ colors: ['', '', '', ''], exactMatches: 0, misplacedMatches: 0, remainingDotsLength: 4 })));
    const [activeRowIndex, setActiveRowIndex] = useState(0);
    const [selectedPawnIndex, setSelectedPawnIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const handleCheck = useCallback(() => {
        if (!gameOver && activeRowIndex !== -1) {
            const currentRow = rows[activeRowIndex];
    
            const isRowComplete = currentRow.colors.every(color => color !== '');
    
            if (isRowComplete) {
                const { exactMatches, misplacedMatches, remainingDotsLength } = checkRow(currentRow.colors);
                const newRows = [...rows];
                newRows[activeRowIndex] = { ...currentRow, exactMatches, misplacedMatches, remainingDotsLength };
                setRows(newRows);
                if (exactMatches === 4 || activeRowIndex === 7) {
                    setGameOver(true);
                } else {
                    setActiveRowIndex(activeRowIndex + 1);
                    setSelectedPawnIndex(0);
                }
            } 
        }
    }, [activeRowIndex, gameOver, rows]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!gameOver && activeRowIndex !== -1) {
                              if (event.key === 'ArrowLeft') {
                    setSelectedPawnIndex((selectedPawnIndex - 1 + 4) % 4);
                } else if (event.key === 'ArrowRight') {
                    setSelectedPawnIndex((selectedPawnIndex + 1) % 4);
                } else if (event.key === 'ArrowUp') {
                    changeColor( 'up');
                } else if (event.key === 'ArrowDown') {
                    changeColor( 'down'); 
                }else if (event.key === 'Enter') {
                    handleCheck();
                }
            }
        };
        
        const changeColor = (direction) => {
            const row = rows[activeRowIndex];
            const currentColorIndex = Colors.indexOf(row.colors[selectedPawnIndex]);
            let newColorIndex;
          
            if (direction === 'down') {
                if (row.colors[selectedPawnIndex] === '') {
                    newColorIndex = Colors.length - 1;
                } else {
                    newColorIndex = currentColorIndex === 0 ? Colors.length - 1 : currentColorIndex - 1;
                }
            } else {
                newColorIndex = currentColorIndex === Colors.length - 1 ? 0 : currentColorIndex + 1;
            }
            const newColor = Colors[newColorIndex];
            const newRows = [...rows];
            const newRow = { ...newRows[activeRowIndex] };
            newRow.colors[selectedPawnIndex] = newColor;
            newRows[activeRowIndex] = newRow;
            setRows(newRows);
        };
        

        document.addEventListener('keydown', handleKeyDown);

        // Nettoyage de l'écouteur d'événements lors du démontage du composant
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeRowIndex, selectedPawnIndex, gameOver, rows, handleCheck]);

    const handleSlotClick = (index) => {
        if (!gameOver && activeRowIndex !== -1) {
            setSelectedPawnIndex(index);
        }
    };

    const handleColorSelect = (color) => {
        if (!gameOver && activeRowIndex !== -1) {
            const newRows = [...rows];
            const newRow = { ...newRows[activeRowIndex] };
            newRow.colors[selectedPawnIndex] = color;
            newRows[activeRowIndex] = newRow;
            setRows(newRows);
            setSelectedPawnIndex((selectedPawnIndex + 1) % 4);
        }
    };

    const checkRow = (rowColors) => {
        let exactMatches = 0;
        let misplacedMatches = 0;

        // Compteur des correspondances exactes
        for (let i = 0; i < rowColors.length; i++) {
            if (rowColors[i] === newCode[i]) {
                exactMatches++;
            }
        }

        // Compteur des correspondances mal placées
        const colorsCount = {};
        const newCodeCount = {};

        // Compter les occurrences de chaque couleur dans 'rowColors'
        for (let color of rowColors) {
            colorsCount[color] = (colorsCount[color] || 0) + 1;
        }

        // Compter les occurrences de chaque couleur dans 'newCode'
        for (let color of newCode) {
            newCodeCount[color] = (newCodeCount[color] || 0) + 1;
        }

        // Trouver les correspondances mal placées
        for (let color in colorsCount) {
            if (newCodeCount[color]) {
                misplacedMatches += Math.min(colorsCount[color], newCodeCount[color]);
            }
        }

        // Soustraire les correspondances exactes pour obtenir les mal placées
        misplacedMatches -= exactMatches;

        // Calculer la longueur restante des points gris
        const remainingDotsLength = 4 - exactMatches - misplacedMatches;

        return { exactMatches, misplacedMatches, remainingDotsLength };
    };

    return (
        <div className="board">
            { gameOver && <SecretCode/> }
            {rows.map((row, index) => (
                <div key={index} className={`row ${index === activeRowIndex ? 'active' : 'inactive'}`}>
                    <div className='slotSelector'>
                        {row.colors.map((color, colorIndex) => (
                            <Slot
                                key={colorIndex}
                                color={color}
                                onClick={() => handleSlotClick(colorIndex)}
                                isActive={index === activeRowIndex && colorIndex === selectedPawnIndex}
                            />
                        ))}
                    </div>
                    <div className="feedback">
                        {[...Array(row.remainingDotsLength)].map((_, index) => (
                            <div key={index} className='dot'></div>
                        ))}
                        {[...Array(row.exactMatches)].map((_, index) => (
                            <div key={index} className="black-dot"></div>
                        ))}
                        {[...Array(row.misplacedMatches)].map((_, index) => (
                            <div key={index} className="white-dot"></div>
                        ))}
                        
                    </div>
                </div>
            ))}
            <ColorsPalette colors={Colors} onClick={handleColorSelect} />
            <button onClick={handleCheck} disabled={gameOver}>Check</button>
        </div>
    );
};
