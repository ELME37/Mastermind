import React, { useState, useEffect, useCallback } from 'react';
import './styles.scss';
import Header from '../header';
import ControlsPanel from '../controlspanel';
import Row from '../row';
import ColorsPalette from '../colorsPalette';
import { Colors, Colors8 } from '../colors';
import SecretCode, { generateRandomCode } from '../secretCode';
import Modal from '../modal';
import AnimationBomb from '../animationBomb';

export default function Board({ level }) {

    const [rows, setRows] = useState(Array.from({ length: 8 }, () => ({ colors: ['', '', '', ''], exactMatches: 0, misplacedMatches: 0, remainingDotsLength: 4 })));
    const [activeRowIndex, setActiveRowIndex] = useState(0);
    const [selectedPawnIndex, setSelectedPawnIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [newCode, setNewCode] = useState(generateRandomCode(level));
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setModalOpen(false);
      };

    const colorsCode = level === 'Difficile' ? Colors8 : Colors;

    const handleGenerateCode = () => {
        const newCode = generateRandomCode(level);
        setNewCode(newCode);
        console.log("board" + newCode)
    };
    

    const checkRow = useCallback((rowColors) => {
        let exactMatches = 0;
        let misplacedMatches = 0;

        for (let i = 0; i < rowColors.length; i++) {
            if (rowColors[i] === newCode[i]) {
                exactMatches++;
            }
        }

        const colorsCount = {};
        const newCodeCount = {};

        for (let color of rowColors) {
            colorsCount[color] = (colorsCount[color] || 0) + 1;
        }

        for (let color of newCode) {
            newCodeCount[color] = (newCodeCount[color] || 0) + 1;
        }

        for (let color in colorsCount) {
            if (newCodeCount[color]) {
                misplacedMatches += Math.min(colorsCount[color], newCodeCount[color]);
            }
        }

        misplacedMatches -= exactMatches;

        const remainingDotsLength = 4 - exactMatches - misplacedMatches;

        return { exactMatches, misplacedMatches, remainingDotsLength };
    }, [newCode]);

    const handleCheck = useCallback(() => {
        if (!gameOver && activeRowIndex !== -1) {
            const currentRow = rows[activeRowIndex];
    
            const isRowComplete = currentRow.colors.every(color => color !== '');
    
            if (isRowComplete) {
                let { exactMatches, misplacedMatches, remainingDotsLength } = checkRow(currentRow.colors);
                const newRows = [...rows];
                newRows[activeRowIndex] = { ...currentRow, exactMatches, misplacedMatches, remainingDotsLength };
    
                // Adjust behavior based on the selected level
                if (level === 'Facile') {
                    // If beginner level, move correct colors to the next row
                    if (activeRowIndex < rows.length - 1) {
                        // Vérifiez si ce n'est pas la dernière ligne
                        const newRow = { ...newRows[activeRowIndex + 1] };
                        // Vérifiez s'il n'y a aucune couleur trouvée sur la ligne actuelle
                        const foundColors = newRows[activeRowIndex].colors.filter((color, index) => color === newCode[index]);
                        const noFoundColors = foundColors.length === 0;
                        if (!noFoundColors) {
                            // Vérifiez si la ligne suivante ne contient pas déjà de couleurs trouvées
                            const nextRowFoundColors = newRows[activeRowIndex + 1].colors.filter(color => color !== '');
                            const nextRowNoFoundColors = nextRowFoundColors.length === 0;
                            if (nextRowNoFoundColors) {
                                // Copiez les couleurs trouvées de la ligne actuelle sur la ligne suivante
                                for (let i = 0; i < currentRow.colors.length; i++) {
                                    if (currentRow.colors[i] === newCode[i]) {
                                        newRow.colors[i] = currentRow.colors[i];
                                    }
                                }
                                newRows[activeRowIndex + 1] = newRow;
                            }
                        }
                    }
                } 
    
                setRows(newRows);
                if (exactMatches === 4 || activeRowIndex === 7) {
                    setGameOver(true);
                    // Si le code a été trouvé sur la ligne active, passez la ligne active en inactif
                    if (exactMatches === 4) {
                        setActiveRowIndex(-1);
                    }
                } else {
                    setActiveRowIndex(activeRowIndex + 1);
                    setSelectedPawnIndex(0);
                }
            }
        }
    }, [activeRowIndex, gameOver, rows, checkRow, level, newCode, setRows, setGameOver, setActiveRowIndex, setSelectedPawnIndex]);
    

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!gameOver && activeRowIndex !== -1) {
                if (event.key === 'ArrowLeft') {
                    setSelectedPawnIndex((selectedPawnIndex - 1 + 4) % 4);
                } else if (event.key === 'ArrowRight') {
                    setSelectedPawnIndex((selectedPawnIndex + 1) % 4);
                } else if (event.key === 'ArrowUp') {
                    changeColor('up');
                } else if (event.key === 'ArrowDown') {
                    changeColor('down');
                } else if (event.key === 'Enter') {
                    handleCheck();
                }
            }
        };

        const changeColor = (direction) => {
            const row = rows[activeRowIndex];
            const currentColorIndex = colorsCode.indexOf(row.colors[selectedPawnIndex]);
            let newColorIndex;

            if (direction === 'down') {
                if (row.colors[selectedPawnIndex] === '') {
                    newColorIndex = colorsCode.length - 1;
                } else {
                    newColorIndex = currentColorIndex === 0 ? colorsCode.length - 1 : currentColorIndex - 1;
                }
            } else {
                newColorIndex = currentColorIndex === colorsCode.length - 1 ? 0 : currentColorIndex + 1;
            }
            const newColor = colorsCode[newColorIndex]; // Utilisez colorsCode ici
            const newRows = [...rows];
            const newRow = { ...newRows[activeRowIndex] };
            newRow.colors[selectedPawnIndex] = newColor;
            newRows[activeRowIndex] = newRow;
            setRows(newRows);
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeRowIndex, selectedPawnIndex, gameOver, rows, handleCheck, colorsCode]); // Ajoutez colorsCode ici

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

            // Trouver l'index du prochain slot vide
            let nextEmptySlotIndex = selectedPawnIndex;
            let allSlotsFilled = true; // Variable pour vérifier si tous les slots sont remplis
            for (let i = 0; i < newRow.colors.length; i++) {
                if (newRow.colors[i] === '') {
                    nextEmptySlotIndex = i;
                    allSlotsFilled = false;
                    break;
                }
            }

            // Si tous les slots sont remplis, revenir au premier slot
            if (allSlotsFilled) {
                nextEmptySlotIndex = 0;
            }

            setSelectedPawnIndex(nextEmptySlotIndex);

            newRows[activeRowIndex] = newRow;
            setRows(newRows);
        }
    };
    
    const startGame = () => {
        setActiveRowIndex(0);
        setRows(Array.from({ length: 8 }, () => ({ colors: ['', '', '', ''], exactMatches: 0, misplacedMatches: 0, remainingDotsLength: 4 })));
        setGameOver(false);
        handleGenerateCode();
        console.log("test")
    };

    return (
        <div className="board">
            <Modal isOpen={modalOpen} onClose={handleCloseModal}>
                    <div className='modal__rules'>
                        <span className='modal__title'>Règles du jeu TicTac Boom</span>
                        <div className='modal__section'>
                            <p className='modal__text'>TicTac Boom est un jeu de déduction basé sur Mastermind.</p>
                            <p className='modal__text'>Découvrez le code secret avant la fin du temps imparti pour gagner.</p>
                        </div>
                        <div className='modal__section'>
                            <p className='modal__text'><strong>3 niveaux de jeu</strong> pour toute la famille mais un seul but :</p>
                            <p className='modal__text'><strong>60 secondes</strong> avant que la bombe n'explose.</p>
                        </div>
                        <div className='modal__section'>
                            <ul className='modal__text'>Avancez ligne par ligne et découvrez votre progression :
                                <li className='modal__text'><strong>1 pion blanc</strong> = vous avez une bonne couleur mais mal placée</li>
                                <li className='modal__text'><strong>1 pion noir</strong> = vous avez une bonne couleur et bien placée</li>
                            </ul>
                        </div>
                        <div className='modal__section'>
                            <p className='modal__text'>Jouez avec votre souris ou directement avec <strong>les touches directionnelles du clavier</strong>.</p>
                        </div>
                        <div className='modal__section'>
                            <p className='modal__text'>Prêt à relever le défi ? À vous de jouer !</p>
                        </div>
                    </div>
                </Modal>
            <div className='board__header'>
                <Header/>
                <ControlsPanel startGame={startGame} handleOpenModal={handleOpenModal}/>
            </div>
            <div className='container__secretcode'>
                <div className={`text__secretcode ${gameOver ? 'animate' : ''}`}>Secret Code</div>
                {gameOver && <SecretCode newCode={newCode}/>}
            </div>
            <div className='board__game'>
                <AnimationBomb/>
                <p className='game__niveau'>Niveau : {level}</p>
                <div className='rows'>
                    {rows.map((row, index) => (
                        <Row
                            key={index}
                            row={row}
                            rowIndex={index}
                            activeRowIndex={activeRowIndex}
                            selectedPawnIndex={selectedPawnIndex}
                            onSlotClick={handleSlotClick}
                            onCheckRow={handleCheck}
                        />
                    ))}
                </div>
                <ColorsPalette
                    className={`${colorsCode.length === 8 ? 'colorsPalette8' : ''}`}
                    colors={colorsCode}
                    onClick={handleColorSelect}
                />
            </div>
        </div>
    );
};
