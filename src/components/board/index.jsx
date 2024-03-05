import React, { useState, useEffect, useCallback } from 'react';
import './styles.scss';
import Header from '../header';
import ControlsPanel from '../controlspanel';
import Row from '../row';
import ColorsPalette from '../colorsPalette';
import { Colors, Colors8 } from '../colors';
import SecretCode, { GenerateRandomCode } from '../secretCode';
import Modal from '../modal';
import AnimationBomb, {ResetAnimation} from '../animationBomb';
import Pause from '../pause';
import EndGameMessage from '../endGameMessage';

export default function Board({ level }) {

    let chrono = 90 // chrono du décompte avant animation

    // États du composant
    const [rows, setRows] = useState(Array.from({ length: 8 }, () => ({ colors: ['', '', '', ''], exactMatches: 0, misplacedMatches: 0, remainingDotsLength: 4 })));
    const [activeRowIndex, setActiveRowIndex] = useState(0);
    const [selectedPawnIndex, setSelectedPawnIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [newCode, setNewCode] = useState(GenerateRandomCode(level));
    const [modalOpen, setModalOpen] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [animationVisible, setAnimationVisible] = useState(true);
    const [endGameMessageOpen, setEndGameMessageOpen] = useState(false);
    const [endGameMessage, setEndGameMessage] = useState("");
    const [timeLeft, setTimeLeft] = useState(chrono);

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

    // Fonctions de gestion des aniamtions
    const toggleAnimation = () => {
        setIsPaused(true); // Met en pause l'animation
    };

    // Fonction pour redémarrer l'animation
    const restartAnimation = () => {
        setIsPaused(false); // Redémarre l'animation
    };

    const toggleAnimationVisible = () => {
        setAnimationVisible(false);
    };

    // Fonctions de gestion des endGameMessage
    const handleOpenEndGameMessage = useCallback(() => {
        setEndGameMessageOpen(true);
    }, [setEndGameMessageOpen]);
    
    const handleCloseEndGameMessage = () => {
        setEndGameMessageOpen(false);
    };

    // Détermination de la palette de couleurs en fonction du niveau
    const colorsCode = level === 'Difficile' ? Colors8 : Colors;

    // Génération d'un nouveau code secret
    const handleGenerateCode = () => {
        const newCode = GenerateRandomCode(level);
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
                    toggleAnimationVisible()
                    setTimeout(() => {
                    handleOpenEndGameMessage()
                    setEndGameMessage(  <>
                        <div className='endGameMessage__container'>
                            <svg className='endGameMessage__win' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/>
                            </svg>
                                <p className='endGameMessage__title'>Gagné !</p>
                            <svg className='endGameMessage__win' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/>
                            </svg>
                        </div>
                        <p className='endGameMessage__text'>Félicitation, vous avez désamorcé la bombe.</p>
                        <p className='endGameMessage__text'>Retentez l'aventure !</p>
                    </>);
                    }, 5000);
                    
                } else {
                    toggleAnimationVisible()
                    setTimeout(() => {
                        handleOpenEndGameMessage();
                        setEndGameMessage(  <>
                            <div className='endGameMessage__container'>
                                <svg className='endGameMessage__loose' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M459.1 52.4L442.6 6.5C440.7 2.6 436.5 0 432.1 0s-8.5 2.6-10.4 6.5L405.2 52.4l-46 16.8c-4.3 1.6-7.3 5.9-7.2 10.4c0 4.5 3 8.7 7.2 10.2l45.7 16.8 16.8 45.8c1.5 4.4 5.8 7.5 10.4 7.5s8.9-3.1 10.4-7.5l16.5-45.8 45.7-16.8c4.2-1.5 7.2-5.7 7.2-10.2c0-4.6-3-8.9-7.2-10.4L459.1 52.4zm-132.4 53c-12.5-12.5-32.8-12.5-45.3 0l-2.9 2.9C256.5 100.3 232.7 96 208 96C93.1 96 0 189.1 0 304S93.1 512 208 512s208-93.1 208-208c0-24.7-4.3-48.5-12.2-70.5l2.9-2.9c12.5-12.5 12.5-32.8 0-45.3l-80-80zM200 192c-57.4 0-104 46.6-104 104v8c0 8.8-7.2 16-16 16s-16-7.2-16-16v-8c0-75.1 60.9-136 136-136h8c8.8 0 16 7.2 16 16s-7.2 16-16 16h-8z"/>
                                </svg>
                                    <p className='endGameMessage__title'>Perdu !</p>
                                <svg className='endGameMessage__loose' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M459.1 52.4L442.6 6.5C440.7 2.6 436.5 0 432.1 0s-8.5 2.6-10.4 6.5L405.2 52.4l-46 16.8c-4.3 1.6-7.3 5.9-7.2 10.4c0 4.5 3 8.7 7.2 10.2l45.7 16.8 16.8 45.8c1.5 4.4 5.8 7.5 10.4 7.5s8.9-3.1 10.4-7.5l16.5-45.8 45.7-16.8c4.2-1.5 7.2-5.7 7.2-10.2c0-4.6-3-8.9-7.2-10.4L459.1 52.4zm-132.4 53c-12.5-12.5-32.8-12.5-45.3 0l-2.9 2.9C256.5 100.3 232.7 96 208 96C93.1 96 0 189.1 0 304S93.1 512 208 512s208-93.1 208-208c0-24.7-4.3-48.5-12.2-70.5l2.9-2.9c12.5-12.5 12.5-32.8 0-45.3l-80-80zM200 192c-57.4 0-104 46.6-104 104v8c0 8.8-7.2 16-16 16s-16-7.2-16-16v-8c0-75.1 60.9-136 136-136h8c8.8 0 16 7.2 16 16s-7.2 16-16 16h-8z"/>
                                </svg>
                            </div>
                            <p className='endGameMessage__text'>Vous avez fait exploser la bombe.</p>
                            <p className='endGameMessage__text'>Vous n'avez pas réussi à trouver le bon code.</p>
                            <p className='endGameMessage__text'>Essayez encore !</p>
                        </>);
                    }, 5000);
                }
            } else {
                setActiveRowIndex(activeRowIndex + 1);
                if (level !== 'Facile') {
                    setSelectedPawnIndex(0);
                }
            }
        }
    }
}, [activeRowIndex, gameOver, rows, checkRow, level, newCode, setRows, setGameOver, setActiveRowIndex, setSelectedPawnIndex, handleOpenEndGameMessage]);

useEffect(() => {
    // Vérifie si le jeu n'est pas terminé et n'est pas en pause
    if (!gameOver && timeLeft > 0 && !isPaused) {
        // Décrémente le temps restant toutes les secondes
        const timer = setInterval(() => {
            setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
        }, 1000);
        // Nettoie le timer quand le composant est démonté ou que le jeu est terminé
        return () => clearInterval(timer);
    } else if (timeLeft === 0 && !gameOver) {
        // Gère le cas où le temps est écoulé mais le jeu n'est pas terminé
        setGameOver(true);
        handleOpenEndGameMessage();
        setEndGameMessage(  <>
            <div className='endGameMessage__container'>
                <svg className='endGameMessage__loose' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M459.1 52.4L442.6 6.5C440.7 2.6 436.5 0 432.1 0s-8.5 2.6-10.4 6.5L405.2 52.4l-46 16.8c-4.3 1.6-7.3 5.9-7.2 10.4c0 4.5 3 8.7 7.2 10.2l45.7 16.8 16.8 45.8c1.5 4.4 5.8 7.5 10.4 7.5s8.9-3.1 10.4-7.5l16.5-45.8 45.7-16.8c4.2-1.5 7.2-5.7 7.2-10.2c0-4.6-3-8.9-7.2-10.4L459.1 52.4zm-132.4 53c-12.5-12.5-32.8-12.5-45.3 0l-2.9 2.9C256.5 100.3 232.7 96 208 96C93.1 96 0 189.1 0 304S93.1 512 208 512s208-93.1 208-208c0-24.7-4.3-48.5-12.2-70.5l2.9-2.9c12.5-12.5 12.5-32.8 0-45.3l-80-80zM200 192c-57.4 0-104 46.6-104 104v8c0 8.8-7.2 16-16 16s-16-7.2-16-16v-8c0-75.1 60.9-136 136-136h8c8.8 0 16 7.2 16 16s-7.2 16-16 16h-8z"/>
                </svg>
                <p className='endGameMessage__title'>Perdu !</p>
                <svg className='endGameMessage__loose' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M459.1 52.4L442.6 6.5C440.7 2.6 436.5 0 432.1 0s-8.5 2.6-10.4 6.5L405.2 52.4l-46 16.8c-4.3 1.6-7.3 5.9-7.2 10.4c0 4.5 3 8.7 7.2 10.2l45.7 16.8 16.8 45.8c1.5 4.4 5.8 7.5 10.4 7.5s8.9-3.1 10.4-7.5l16.5-45.8 45.7-16.8c4.2-1.5 7.2-5.7 7.2-10.2c0-4.6-3-8.9-7.2-10.4L459.1 52.4zm-132.4 53c-12.5-12.5-32.8-12.5-45.3 0l-2.9 2.9C256.5 100.3 232.7 96 208 96C93.1 96 0 189.1 0 304S93.1 512 208 512s208-93.1 208-208c0-24.7-4.3-48.5-12.2-70.5l2.9-2.9c12.5-12.5 12.5-32.8 0-45.3l-80-80zM200 192c-57.4 0-104 46.6-104 104v8c0 8.8-7.2 16-16 16s-16-7.2-16-16v-8c0-75.1 60.9-136 136-136h8c8.8 0 16 7.2 16 16s-7.2 16-16 16h-8z"/>
                </svg>
            </div>
            <p className='endGameMessage__text'>Vous avez manqué de temps.</p>
            <p className='endGameMessage__text'>La bombe a explosé</p>
            <p className='endGameMessage__text'>Essayez encore !</p>
        </>);
    }
}, [timeLeft, gameOver, setGameOver, handleOpenEndGameMessage, isPaused]);

    

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
        ResetAnimation();
        setAnimationVisible(true)
        setTimeLeft(chrono);
    };

    return (
        <div className="board">
            <Modal isOpen={modalOpen} onClose={handleCloseModal} restartAnimation={restartAnimation}>
                <div className='modal__rules'>
                    <span className='modal__title'>Règles du jeu TicTac Boom</span>
                    <div className='modal__section'>
                        <p className='modal__text'>TicTac Boom est un jeu de déduction basé sur Mastermind.</p>
                        <p className='modal__text'>Découvrez le code secret avant la fin du temps imparti pour gagner.</p>
                    </div>
                    <div className='modal__section'>
                        <p className='modal__text'><strong>3 niveaux de jeu</strong> pour toute la famille mais un seul but :</p>
                        <p className='modal__text'><strong>90 secondes</strong> avant que la bombe n'explose.</p>
                    </div>
                    <div className='modal__section'>
                        <ul className='modal__text'>Avancez ligne par ligne et découvrez votre progression :
                            <li className='modal__text'><strong>1 pion blanc</strong> = vous avez une bonne couleur mais mal placée</li>
                            <li className='modal__text'><strong>1 pion noir</strong> = vous avez une bonne couleur et bien placée</li>
                        </ul>
                    </div>
                    <div className='modal__section'>
                        <p className='modal__text'>Jouez avec votre souris ou directement avec <strong>les touches directionnelles du clavier + la touche Enter</strong>.</p>
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
                <AnimationBomb isPaused={isPaused} isVisible={animationVisible}/>
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
            <EndGameMessage isOpen={endGameMessageOpen} closeEndGameMessage= {handleCloseEndGameMessage} newGame= {startGame}>{endGameMessage}</EndGameMessage>
        </div>
    );
};
