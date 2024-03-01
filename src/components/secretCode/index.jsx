import React from 'react';
import './styles.scss';
import Slot from '../slot';
import { Colors, Colors8 } from '../colors';


export const generateRandomCode = (level) => {
    const code = [];
    const colorsSecretCode = level === 'Difficile' ? Colors8 : Colors;
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * colorsSecretCode.length);
        code.push(colorsSecretCode[randomIndex]);
    }

    return code;
};

export default function SecretCode({ newCode }) {
    console.log("test" + newCode)
    return (
        <div className="checking">
            <div className="code">
                {newCode.map((color, index) => (
                    <Slot key={index} color={color} />
                ))}
            </div>
        </div>
    );
}
