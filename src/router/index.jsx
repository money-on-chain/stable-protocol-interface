import React from 'react';

import { config } from '../projects/config';

const RouterMoC = React.lazy(() => import('./projects/moc'));

const Router = () => {
    switch (config.environment.AppProject.toLowerCase()) {
        case 'moc':
            return RouterMoC;
        default:
            return RouterMoC;
    }
};

export default Router();
