import React from 'react';
import './styles.scss';
import Logo from '../logo';

export default function Header () {
    return (
        <header className='header'>
            <h1 className='header__title'><Logo styles='logo__game'/></h1>
        </header>
    );
};