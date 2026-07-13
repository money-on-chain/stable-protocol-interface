import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { config } from '../../../projects/config';
import lazyWithRetry from '../../../helpers/lazyWithRetry';

import NotFound from '../../../pages/NotFound';
const Skeleton = lazyWithRetry(() =>
    import(
        '../../../layouts/projects/' +
            config.environment.AppProject.toLowerCase() +
            '/Skeleton'
    )
);

const Home = lazyWithRetry(() => import('../../../pages/Home/index'));
const MintTC = lazyWithRetry(() => import('../../../pages/Mint/MintTC'));
const MintTP = lazyWithRetry(() => import('../../../pages/Mint/MintTP'));
const MintTX = lazyWithRetry(() => import('../../../pages/Mint/MintTX'));
const Rewards = lazyWithRetry(() => import('../../../pages/Rewards'));
const Metrics = lazyWithRetry(() => import('../../../pages/Metrics'));


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
