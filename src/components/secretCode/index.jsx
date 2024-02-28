import React, { useState } from 'react';
import './styles.scss';
import Slot from '../slot';
import { Colors } from '../colors';


const generateRandomCode = () => {
    const code = [];
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * Colors.length);
        code.push(Colors[randomIndex]);
    }
    return code;
};

export const newCode = generateRandomCode();

export default function SecretCode() {
    const [code, setCode] = useState(newCode);

    const handleGenerateCode = () => {
        const newCode = generateRandomCode();
        setCode(newCode);
        
    };

    return (
        <div className="checking">
            <div className="code">
                {code.map((color, index) => (
                    <Slot key={index} color={color} />
                ))}
            </div>
            <button onClick={handleGenerateCode}>Générer un nouveau code</button>
        </div>
    );
}
