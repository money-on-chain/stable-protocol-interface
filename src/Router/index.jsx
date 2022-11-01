import React from 'react';
import { useContext } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import Skeleton from '../Layouts/Skeleton';
import NotFound from '../Pages/NotFound';
const Home = React.lazy(() => import('../Pages/Home/index'));
const MintTC = React.lazy(() => import('../Pages/Mint/MintTC'));
const MintTP = React.lazy(() => import('../Pages/Mint/MintTP'));
const MintTX = React.lazy(() => import('../Pages/Mint/MintTX'));
const Rewards = React.lazy(() => import('../Pages/Rewards'));
const Rbtc = React.lazy(() => import('../Pages/Rbtc'));
const Metrics = React.lazy(() => import('../Pages/Metrics'));

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
                    path: 'wallet/leveraged',
                    element: <MintTX />
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
