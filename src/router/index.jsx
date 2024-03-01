// Import des librairies React
import React from 'react';
import {Routes, Route } from 'react-router-dom';

import Home from '../pages/home';
import Game from '../pages/game';
import Error404 from '../pages/error404';
import ROUTES from './routes';

export default function Router () {
    return (
        <Routes>
            <Route path={ROUTES.home} element={<Home />} />
            <Route path={`${ROUTES.game}/:level`} element={<Game />} />
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
};