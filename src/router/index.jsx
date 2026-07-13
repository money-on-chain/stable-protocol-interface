import { config } from '../projects/config';
import lazyWithRetry from '../helpers/lazyWithRetry';

const RouterMoC = lazyWithRetry(() => import('./projects/moc'));

const Router = () => {
    switch (config.environment.AppProject.toLowerCase()) {
        case 'moc':
            return RouterMoC;
        default:
            return RouterMoC;
    }
};

export default Router();
