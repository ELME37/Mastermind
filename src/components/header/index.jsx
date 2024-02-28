import React from 'react';
import './styles.scss';
import NavBar from '../navBar';

export default function Header () {
    return (
        <header className='header'>
            <h1 className='header__title'>Crack the Code</h1>
            <NavBar/>
        </header>
    );
};