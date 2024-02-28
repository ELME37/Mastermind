import React from 'react';
import './styles.scss';

export default function Slot({ color, onClick, isActive }) {
    return (
        <div
            className={`slot ${isActive ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={onClick}
        >
        </div>
    );
}
