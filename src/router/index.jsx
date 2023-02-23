import React, { useEffect } from 'react';

import {config} from "../projects/config";

const RouterMoC = React.lazy(() => import('./projects/moc'));
const RouterRoC = React.lazy(() => import('./projects/roc'));

const Router = () => {
  switch (config.environment.AppProject.toLowerCase()) {
    case 'moc':
        return RouterMoC
    case 'roc':
        return RouterRoC
    default:
        return RouterMoC
  }

}

export default Router();