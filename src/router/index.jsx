import React, { useEffect } from 'react';

import {config} from "../projects/config";

const RouterMoC = React.lazy(() => import('./projects/moc'));
const RouterRoC = React.lazy(() => import('./projects/roc'));
const RouterFlipago = React.lazy(() => import('./projects/flipago'));

const Router = () => {
  switch (config.environment.AppProject.toLowerCase()) {
    case 'moc':
        return RouterMoC
    case 'roc':
        return RouterRoC
    case 'flipago':
        return RouterFlipago
    default:
        return RouterMoC
  }

}

export default Router();