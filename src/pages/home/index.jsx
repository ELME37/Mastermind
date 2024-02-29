import React from 'react';
import './styles.scss';
import Logo from '../../components/logo';
import Lign from '../../components/lign';

export default function Home() {
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
          <p className='description__text'>Ce défi mental, adapté aussi bien aux enfants qu'à leurs grands-parents, mettra vos compétences de déduction à l'épreuve.</p>
          <p className='description__text'>Soyez rapide, soyez astucieux, et surtout, ne laissez pas la bombe exploser !</p>
          <p className='description__text'>Êtes-vous prêt à relever le défi et à devenir le héros du TicTac Boom ?</p>
        </div>
        <div className='game__niveau'>
          <label htmlFor="niveau">Choisissez votre niveau :</label>
          <select id="niveau" name="niveau">
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="confirme">Confirmé</option>
          </select>
        </div>
        <button className='game__button'>Démarrer la partie</button>
      </div>
    </div>
  );
}