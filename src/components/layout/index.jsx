import React from 'react';
import './styles.scss';

export default function Layout ({children}){
    return (
    <div className="container">
        {children}
    </div>)
}