import React from 'react';
import './styles.scss';
import Header from '../../components/header';
import Board from '../../components/board';
import Footer from '../../components/footer';

export default function Game() {
  return (
    <div className='game'>
      <Header/>
      <Board/>
      <Footer/>
    </div>
  );
}