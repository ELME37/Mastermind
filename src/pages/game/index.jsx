import React from 'react';
import { useParams } from 'react-router-dom';
import './styles.scss';
import Header from '../../components/header';
import Board from '../../components/board';
import Footer from '../../components/footer';

export default function Game() {
  let { level } = useParams();
  
  return (
    <div className='game'>
      <Header/>
      <Board level={level}/>
      <Footer/>
    </div>
  );
}