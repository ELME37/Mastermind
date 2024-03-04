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
import Pause from '../pause';

export default function Board({ level }) {

    // États du composant
    const [rows, setRows] = useState(Array.from({ length: 8 }, () => ({ colors: ['', '', '', ''], exactMatches: 0, misplacedMatches: 0, remainingDotsLength: 4 })));
    const [activeRowIndex, setActiveRowIndex] = useState(0);
    const [selectedPawnIndex, setSelectedPawnIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [newCode, setNewCode] = useState(generateRandomCode(level));
    const [modalOpen, setModalOpen] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Fonctions de gestion des modales
    const handleOpenMessage = () => {
        setMessageOpen(true);
        setIsPaused(true);
    };

    const handleCloseMessage = () => {
        setMessageOpen(false);
    };

    // Fonctions de gestion des modales
    const handleOpenModal = () => {
        setModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const toggleAnimation = () => {
        setIsPaused(true); // Met en pause l'animation
    };

    // Fonction pour redémarrer l'animation
    const restartAnimation = () => {
        setIsPaused(false); // Redémarre l'animation
    };

    // Détermination de la palette de couleurs en fonction du niveau
    const colorsCode = level === 'Difficile' ? Colors8 : Colors;

    // Génération d'un nouveau code secret
    const handleGenerateCode = () => {
        const newCode = generateRandomCode(level);
        setNewCode(newCode);
        console.log(newCode)
    };
    
    // Vérification de la rangée
    const checkRow = useCallback((rowColors) => {
        let exactMatches = 0;
        let misplacedMatches = 0;

        // Comparaison des couleurs avec le code secret
        for (let i = 0; i < rowColors.length; i++) {
            if (rowColors[i] === newCode[i]) {
                exactMatches++;
            }
        }

        // Décompte des couleurs correctes mais mal placées
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

        // Calcul de la longueur des points restants
        const remainingDotsLength = 4 - exactMatches - misplacedMatches;

        return { exactMatches, misplacedMatches, remainingDotsLength };
    }, [newCode]);

// Fonction pour vérifier la rangée actuelle
const handleCheck = useCallback(() => {
    if (!gameOver && activeRowIndex !== -1) {
        const currentRow = rows[activeRowIndex];

        // Vérifie si la rangée est complète
        const isRowComplete = currentRow.colors.every(color => color !== '');

        if (isRowComplete) {
            let { exactMatches, misplacedMatches, remainingDotsLength } = checkRow(currentRow.colors);
            const newRows = [...rows];
            newRows[activeRowIndex] = { ...currentRow, exactMatches, misplacedMatches, remainingDotsLength };

            // Comportement différent selon le niveau de difficulté (Facile)
            if (level === 'Facile') {
                if (activeRowIndex < rows.length - 1) {
                    const nextRow = newRows[activeRowIndex + 1];

                    // Recopie les bonnes couleurs trouvées dans la ligne suivante
                    for (let i = 0; i < currentRow.colors.length; i++) {
                        if (currentRow.colors[i] === newCode[i]) {
                            nextRow.colors[i] = currentRow.colors[i];
                        }
                    }

                    // Trouve le premier slot vide
                    const firstEmptySlotIndex = nextRow.colors.findIndex(color => color === '');

                    if (firstEmptySlotIndex !== -1) {
                        // Si le slot 0 est déjà rempli, passe au premier slot vide
                        setSelectedPawnIndex(firstEmptySlotIndex);
                    }
                }
            }

            setRows(newRows);
            // Détermine si le jeu est terminé
            if (exactMatches === 4 || activeRowIndex === 7) {
                setGameOver(true);
                if (exactMatches === 4) {
                    setActiveRowIndex(-1);
                    handleOpenModal(<div><h2>C'est gagné!</h2><p>Félicitations, vous avez trouvé le code secret!</p></div>);
                } else {
                    handleOpenModal("C'est perdu!");
                }
            } else {
                setActiveRowIndex(activeRowIndex + 1);
                if (level !== 'Facile') {
                    setSelectedPawnIndex(0);
                }
            }
        }
    }
}, [activeRowIndex, gameOver, rows, checkRow, level, newCode, setRows, setGameOver, setActiveRowIndex, setSelectedPawnIndex]);

    

    // Effet pour écouter les touches du clavier
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Vérifie si la partie n'est pas terminée et qu'une rangée est active
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

        // Fonction pour changer la couleur sélectionnée
        const changeColor = (direction) => {
            const row = rows[activeRowIndex];
            const currentColorIndex = colorsCode.indexOf(row.colors[selectedPawnIndex]);
            let newColorIndex;

            // Calcul du nouvel index de couleur en fonction de la direction
            if (direction === 'down') {
                if (row.colors[selectedPawnIndex] === '') {
                    newColorIndex = colorsCode.length - 1;
                } else {
                    newColorIndex = currentColorIndex === 0 ? colorsCode.length - 1 : currentColorIndex - 1;
                }
            } else {
                newColorIndex = currentColorIndex === colorsCode.length - 1 ? 0 : currentColorIndex + 1;
            }
            const newColor = colorsCode[newColorIndex];
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
    }, [activeRowIndex, selectedPawnIndex, gameOver, rows, handleCheck, colorsCode]);

    // Gestion du clic sur un pion
    const handleSlotClick = (index) => {
        // Vérifie si la partie n'est pas terminée et qu'une rangée est active
        if (!gameOver && activeRowIndex !== -1) {
            setSelectedPawnIndex(index);
        }
    };

    // Gestion de la sélection de couleur
    const handleColorSelect = (color) => {
        // Vérifie si la partie n'est pas terminée et qu'une rangée est active
        if (!gameOver && activeRowIndex !== -1) {
            const newRows = [...rows];
            const newRow = { ...newRows[activeRowIndex] };
            newRow.colors[selectedPawnIndex] = color;

            // Trouver l'index du prochain emplacement vide
            let nextEmptySlotIndex = selectedPawnIndex;
            let allSlotsFilled = true; 

            // Parcourir la rangée pour trouver le prochain emplacement vide
            for (let i = 0; i < newRow.colors.length; i++) {
                if (newRow.colors[i] === '') {
                    nextEmptySlotIndex = i;
                    allSlotsFilled = false;
                    break;
                }
            }

            // Si tous les slots sont remplis, rechercher le premier pion vide
            if (allSlotsFilled) {
                for (let i = 0; i < newRow.colors.length; i++) {
                    if (newRow.colors[i] === '') {
                        nextEmptySlotIndex = i;
                        break;
                    }
                }
            } else {
                // Sélectionner le premier pion vide après le pion actuellement sélectionné
                for (let i = selectedPawnIndex + 1; i < newRow.colors.length; i++) {
                    if (newRow.colors[i] === '') {
                        nextEmptySlotIndex = i;
                        break;
                    }
                }
            }

            setSelectedPawnIndex(nextEmptySlotIndex);

            newRows[activeRowIndex] = newRow;
            setRows(newRows);
        }
    };
    
    // Fonction de démarrage du jeu
    const startGame = () => {
        setActiveRowIndex(0);
        setRows(Array.from({ length: 8 }, () => ({ colors: ['', '', '', ''], exactMatches: 0, misplacedMatches: 0, remainingDotsLength: 4 })));
        setGameOver(false);
        handleGenerateCode();
        setSelectedPawnIndex(0);
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
                <ControlsPanel startGame={startGame} handleOpenModal={handleOpenModal} handleOpenMessage={handleOpenMessage} toggleAnimation={toggleAnimation}/>
            </div>
            <div className='container__secretcode'>
                <div className={`text__secretcode ${gameOver ? 'animate' : ''}`}>Secret Code</div>
                {gameOver && <SecretCode newCode={newCode}/>}
            </div>
            <div className='board__game'>
                <Pause isOpen={messageOpen} backToGame={handleCloseMessage} restartAnimation={restartAnimation}/>
                <AnimationBomb isPaused={isPaused} />
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
            <button onClick={toggleAnimation}>test</button>
        </div>
    );
};
