import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';
import Logo from '../../components/logo';
import Lign from '../../components/lign';
import ROUTES from '../../router/routes';


export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState('Normal');

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  console.log(selectedLevel)
  return (
    <div className='home'>
      <div className='home__container'>
        <Logo/>
        <Lign/>
        <div className='game__description'>
          <h2 className='description__text'>Bienvenue dans TicTac Boom !</h2>
          <p className='description__text'>Dans ce jeu palpitant, vous êtes confronté à une course contre la montre pour désamorcer la bombe.</p>
          <p className='description__text'><strong>Votre mission :</strong> percer le mystère du code de désamorçage avant que le compte à rebours n'atteigne zéro.</p>
          <p className='description__text'><strong>Vous avez seulement 90 secondes.</strong></p>
          <p className='description__text'>Ce défi mental, adapté pour tout âge, mettra vos compétences de déduction à l'épreuve.</p>
          <p className='description__text'>Soyez rapide, soyez astucieux, et surtout, ne laissez pas la bombe exploser !</p>
        </div>
        <div className='game__niveau'>
          <label htmlFor="niveau">Choisissez votre niveau :</label>
          <select id="niveau" name="niveau" value={selectedLevel} onChange={handleLevelChange}>
            <option value="Facile">Facile</option>
            <option value="Normal">Normal</option>
            <option value="Difficile">Difficile</option>
          </select>
        </div>
        <Link to={`${ROUTES.game}/${selectedLevel}`}>
          <button className='game__button'>Démarrer la partie</button>
        </Link>
      </div>
    </div>
  );
}