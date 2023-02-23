import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import {config} from "../../../projects/config";

import NotFound from '../../../pages/NotFound';
const Skeleton = React.lazy(() => import('../../../layouts/projects/' + config.environment.AppProject.toLowerCase() + '/Skeleton'));

const Home = React.lazy(() => import('../../../pages/Home/index'));
const MintTC = React.lazy(() => import('../../../pages/Mint/MintTC'));
const MintTP = React.lazy(() => import('../../../pages/Mint/MintTP'));
const MintTX = React.lazy(() => import('../../../pages/Mint/MintTX'));
const Rewards = React.lazy(() => import('../../../pages/Rewards'));
const Rbtc = React.lazy(() => import('../../../pages/Rbtc'));
const Metrics = React.lazy(() => import('../../../pages/Metrics'));

export default function Router() {
    return useRoutes([
        {
            path: '/',
            element: <Skeleton />,
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                {
                    path: 'wallet/pro',
                    element: <MintTC />
                },
                {
                    path: 'wallet/stable',
                    element: <MintTP />
                },
                {
                    path: 'rewards',
                    element: <Rewards />
                },
                {
                    path: 'getRBTC',
                    element: <Rbtc />
                },
                {
                    path: 'metrics',
                    element: <Metrics />
                },
                { path: '404', element: <NotFound /> },
                { path: '*', element: <Navigate to="/404" /> }
            ]
        },
        { path: '*', element: <Navigate to="/404" replace /> }
    ]);
}
